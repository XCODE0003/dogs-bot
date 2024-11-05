import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {InlineKeyboard} from "grammy";
import {userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";

export const setSupCode = new Scene<Context>('setSupportCode-scene')

setSupCode.always().callbackQuery('cancel setSupportCode', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    return ctx.scene.exit()
})

setSupCode.do(async (ctx) => {
    const msg = await ctx.reply(`
🍃 Отправь свой <a href="https://www.smartsupp.com/"><b>Smartsupp</b></a> код

<a href="https://www.google.com/"><b>Гайд</b></a>, как настроить и установить`, {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel setSupportCode')
    })

    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
})

setSupCode.wait().on("message:text",async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.user.supportCode = ctx.msg.text
    ctx.user.supportCode = null

    await ctx.reply(`✅ <b>Smartsupp код</b>
<code>${ctx.user.supportCode}</code>`, {
        reply_markup:  new InlineKeyboard()
            .text('Закрыть', 'deleteThisMessage')
    })
    try {
        if (ctx.user.supportTeam) {
            ctx.user.supportTeam = false
        }
    } catch (e) {}
    await userRepository.save(ctx.user)

    ctx.scene.exit()
    return deleteAllMessages(ctx.session.deleteMessage, ctx)
})

async function deleteAllMessages(array: number[], ctx: Context) {
    for (const id of array) {
        try {
            await ctx.api.deleteMessage(ctx.chat.id,id).catch()
        } catch (e) {
            console.log(e)
        }
    }
}