import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {logsRepository, userRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {notificationBot} from "@/utils/bot";
import {getUsername} from "@/helpers/getUsername";

export const scene = new Scene<Context>('logRedirectQuestion')
export const composer = new Composer<Context>()
const regex = /log redirect question (?<id>\d+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = match.groups.id
    await ctx.scenes.enter('logRedirectQuestion', {
        id
    })
}

scene.always().callbackQuery('cancel logRedirectQuestion', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
})

scene.do(async (ctx) => {
    ctx.session.logId = Number(ctx.scene.opts.arg.id)

    const msg = await ctx.reply("<b>⁉️ Введи текст или вопрос:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel logRedirectQuestion')
    })
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
})

scene.wait().on("message:text",async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.session.text = ctx.msg.text

    const res = await ctx.reply(`<code>${ctx.msg.text}</code>`, {
        reply_markup:  new InlineKeyboard()
            .text('С кнопкой', 'btn')
            .text('БЕЗ кнопки', 'without btn')
            .row()
            .text('Отмена', 'cancel logRedirectQuestion')
    })

    ctx.session.deleteMessage.push(res.message_id)
    ctx.scene.resume()
})

scene.wait().on('callback_query:data', async ctx => {
    console.log(ctx)
    const log = await logsRepository.findOne({
        relations: ['ad', 'ad.author', 'ad.acceptedLog'],
        where: {id: ctx.session.logId}
    })

    log.question = ctx.session.text.replaceAll('\n', '<br/>')
    log.redirectTo = 'question'
    log.questionBtn = ctx.callbackQuery.data === 'btn';

    await logsRepository.save(log)

    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
    await ctx.answerCallbackQuery({
        text: `
👍 Запрос на редирект "Свой вопрос" успешно отправлен
`.replace(`\n`, ''),
        show_alert: true
    })
    await notificationBot.api.sendMessage(log.ad?.author?.tgId, `🔔 ${await getUsername(log.ad.acceptedLog)} Выполнил перевод на свой вопрос`, {
        reply_to_message_id: log.msgWorkerId
    })
})