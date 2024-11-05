import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {logsRepository, userRepository} from "@/database";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {notificationBot} from "@/utils/bot";
import {getUsername} from "@/helpers/getUsername";
import {lonelyRepository} from "@/database/lonelypups";

export const scene = new Scene<Context>('pushError')
export const composer = new Composer<Context>()
const regex = /log set error (?<id>\d+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = match.groups.id
    await ctx.scenes.enter('pushError', {
        id
    })
}

scene.always().callbackQuery('cancel pushError', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
})

scene.do(async (ctx) => {
    ctx.session.logId = Number(ctx.scene.opts.arg.id)

    const msg = await ctx.reply("<b>⁉️ Введи текст:</b>", {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel pushError')
    })
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
})

scene.wait().hears(/.+/gmi, async ctx => {
    try {ctx.deleteMessage()} catch (e) {}
    const log = await lonelyRepository.getOrder(ctx.session.logId)


    await lonelyRepository.setOrder(Number(ctx.session.logId), {
        status: "wait",
        error: ctx.message.text
    })

    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
    await ctx.reply(`
#ID_${log.id}

👍 Запрос на <b>ошибку с текстом</b> отправлен
`, {
    reply_to_message_id: log["messageId"],
        reply_markup:  new InlineKeyboard()
            .text('Закрыть', 'deleteThisMessage')
    })
})