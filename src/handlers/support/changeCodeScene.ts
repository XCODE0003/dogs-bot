import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {supportsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /^support update code/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('support-update-code')
}

export const scene = new Scene<Context>('support-update-code')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel support-update-code', cancel)

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []

    const response = await ctx.reply(`
🍃 Отправь свой <a href="https://www.smartsupp.com/"><b>Smartsupp</b></a> код

<a href="https://telegra.ph/Nastrojka-Smartsupp-10-06"><b>Гайд</b></a>, как настроить и установить 
`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel support-update-code'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

scene.wait().hears(/\w+/gmi, async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)

    ctx.user.supportCode = ctx.msg.text
    await userRepository.save(ctx.user)

    await ctx.reply('Код успешно изменен', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })

    return cancel(ctx)
})