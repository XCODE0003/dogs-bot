import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {adsRepository, mentorsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /ad amount (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('ad-set-amount')
}

export const scene = new Scene<Context>('ad-set-amount')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel ad-set-amount', cancel)

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const response = await ctx.reply(`🪵 <b>Введите новую цену</b>\n<code>Пример: 23.99</code>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel ad-set-amount'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

scene.wait().hears(/(^\d+\.\d\d)|(^\d+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)

    const ad = await adsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    })

    if (!ad) return ctx.reply(`ad undefined`)

    let currency = "€"
    if (ad.service === 'facebook') currency = 'Kč'
    ad.price = (parseFloat(ctx.match[0])).toFixed(2) + ` ${currency}`

    await adsRepository.save(ad)

    await ctx.reply(`✅ <b>Новая цена</b> <code>${ad.price}</code>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})