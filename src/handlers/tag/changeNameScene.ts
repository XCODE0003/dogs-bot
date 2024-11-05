import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /tag change/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('change-username')
}

export const scene = new Scene<Context>('change-username')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel change-username', cancel)

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []
    const response = await ctx.reply(`Введите новый <b>tag</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel change-username'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

scene.wait().hears(/(?<tag>.+)/gmsi, async ctx => {
    const match = /(?<tag>.+)/gmsi.exec(ctx.message.text)
    const newTag = match.groups.tag
    ctx.session.deleteMessage.push(ctx.message.message_id)

    if (newTag.length > 15) {
        await ctx.reply('Длина не может превышать 8 символов', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    ctx.user.tag = newTag
    await userRepository.save(ctx.user)

    await cancel(ctx)
    return  ctx.reply(`👍Твой тэг успешно изменен на <b>${ctx.user.tag}</b>`,{
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
})

