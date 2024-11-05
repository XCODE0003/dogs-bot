import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {mentorsRepository, supportsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /support change description (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('support-change-desc')
}

export const changeDescSceneSupport = new Scene<Context>('support-change-desc')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

changeDescSceneSupport.always().callbackQuery('cancel support-change-desc', cancel)

changeDescSceneSupport.do(async (ctx) => {
    ctx.session.supports = {code: undefined, percent: undefined,description: undefined}
    ctx.session.deleteMessage = []
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const response = await ctx.reply(`Введите новое описание для ТП`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel support-change-desc'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

changeDescSceneSupport.wait().on("message:text", async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)
    ctx.session.supports.description = ctx.message.text

    const support = await supportsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    })

    if (!support) {
        await ctx.reply('Support undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    support.description = ctx.session.supports.description
    await supportsRepository.save(support)

    await ctx.reply('Описание успешно изменено', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})