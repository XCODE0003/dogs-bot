import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {InlineKeyboard} from "grammy";
import {userRepository} from "@/database";

export const setTetherScene = new Scene<Context>('setTether-scene')

setTetherScene.always().callbackQuery('cancel setTether', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
})

setTetherScene.do(async (ctx: Context) => {
    const msg = await ctx.reply("Отправьте <code>Tether(TRC-20)</code> адрес", {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel setTether')
    })
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
})

setTetherScene.wait().on("message:text",async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.user.trcAddress = ctx.msg.text
    await userRepository.save(ctx.user)

    ctx.scene.exit()
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    return ctx.reply(`🌳 <code>Tether (TRC-20)</code>
<code>${ctx.user.trcAddress}</code>`, {
        reply_markup:  new InlineKeyboard()
            .text('Закрыть', 'deleteThisMessage')
    })
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