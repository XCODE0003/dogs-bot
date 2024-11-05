import {Context} from "@/database/models/context";
import {Composer, InputFile} from "grammy";
import {settingsRepository, userRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {config} from "@/utils/config";
import {stickerList} from "@/utils/stickerList";
import {UserRole} from "@/database/models/user";

const regex = /admin work (?<status>start|stop)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const status = match.groups.status
    const messageIds = []

    const settings = await settingsRepository.findOne({where: {id: 1}})
    const users = await userRepository.find()

    const response = await ctx.reply(`Начинаю рассылку...`)
    messageIds.push(response.message_id)
    const result = {
        yep: 0,
        nope: []
    }

    settings.work = status === 'start';
    await settingsRepository.save(settings)

    const reply_markup = {
        inline_keyboard: [
            [{text: "Меню", callback_data: "menuWithPicture"}]
        ]
    }

    await ctx.api.sendSticker(config.chats.chat, (status === 'start') ? stickerList.fullBattery : stickerList.lowBattery)
    await ctx.api.sendMessage(config.chats.chat, `${(status === 'start') ? '💚 FULL WORK' : '🛑 STOP WORK'}`)

    for (const user of users) {
        try {
            if (user.role === UserRole.VBIVER || user.role === UserRole.WORKER) {
                await ctx.api.sendSticker(user.tgId, (status === 'start') ? stickerList.fullBattery : stickerList.lowBattery)
                await ctx.api.sendMessage(user.tgId, `${(status === 'start') ? '💚 FULL WORK' : '🛑 STOP WORK'}`, {reply_markup})
                result.yep++
            }
        } catch (e) {
            console.log(e)
            result.nope.push({id: user.tgId,text: e.toString()})
        }
        await new Promise(res => setTimeout(res, 1000 * 0.35));
    }

    let text = 'INFO'
    for (const one of result.nope) {
        text += `\n\nid: ${one.id}\nproblem: ${one.text}`
    }

    await deleteAllMessages(messageIds, ctx)

    return ctx.replyWithDocument(new InputFile(Buffer.from(text, 'utf-8'), 'result.txt'), {

        caption: `Отправлено юзерам: ${result.yep}\n${result.nope.length} с ошибкой (чек файл)`,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
}