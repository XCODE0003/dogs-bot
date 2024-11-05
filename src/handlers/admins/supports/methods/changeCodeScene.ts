import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {mentorsRepository, supportsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /support change code (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('support-change-code')
}

export const changeCodeSceneSupport = new Scene<Context>('support-change-code')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

changeCodeSceneSupport.always().callbackQuery('cancel support-change-code', cancel)

changeCodeSceneSupport.do(async (ctx) => {
    ctx.session.supports = {code: undefined,description: undefined, percent: undefined}
    ctx.session.deleteMessage = []
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const response = await ctx.reply(`Введите новый код для этого наставника`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel support-change-code'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

changeCodeSceneSupport.wait().hears(/.+/gmi, async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)
    ctx.session.supports.code = ctx.msg.text

    const sup = await supportsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    })

    if (!sup) {
        await ctx.reply('Support undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    sup.code = ctx.session.supports.code
    await supportsRepository.save(sup)

    await ctx.reply('Процент успешно изменен', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})