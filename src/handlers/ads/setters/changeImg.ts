import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {adsRepository, mentorsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /ad img (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('ad-set-img')
}

export const scene = new Scene<Context>('ad-set-img')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel ad-set-img', cancel)

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const response = await ctx.reply(`🌱 <b>Введите новую ссылку на изображение</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel ad-set-img'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

scene.wait().hears(/(^.+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)
    const message = ctx.match[1]
    const ad = await adsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    })

    if (!ad) return ctx.reply(`ad undefined`)

    ad.img = message

    await adsRepository.save(ad)

    await ctx.reply(`✅ <b>Новая ссылка</b> <code>${ad.img}</code>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})