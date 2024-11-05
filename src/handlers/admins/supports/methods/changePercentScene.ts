import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {mentorsRepository, supportsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /^support change percent (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('support-change-percent')
}

export const changePercentSceneSupport = new Scene<Context>('support-change-percent')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

changePercentSceneSupport.always().callbackQuery('cancel support-change-percent', cancel)

changePercentSceneSupport.do(async (ctx) => {
    ctx.session.supports = {code: undefined, percent: undefined,description: undefined}
    ctx.session.deleteMessage = []
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const response = await ctx.reply(`Введите новый процент для ТП`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel support-change-percent'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

changePercentSceneSupport.wait().hears(/^\d\d|^\d/, async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)
    console.log(Number(ctx.match[0]), ctx.match, ctx.match[0])
    ctx.session.supports.percent = Number(ctx.match[0])

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

    support.percent = ctx.session.supports.percent
    await supportsRepository.save(support)

    await ctx.reply('Процент успешно изменен', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})