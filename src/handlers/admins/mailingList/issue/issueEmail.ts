import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {mentorsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /email issue (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('email-issue')
}

export const scene = new Scene<Context>('email-issue')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel email-issue', cancel)

scene.do(async (ctx) => {
    ctx.session.mentors = {description: undefined, percent: undefined}
    ctx.session.deleteMessage = []
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const response = await ctx.reply(`Сколько вы хотите выдать писем?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel email-issue'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

scene.wait().hears(/(?<num>\d+)/gmi, async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)
    const num = Number(/(?<num>\d+)/gmi.exec(ctx.message.text).groups.num)

    const user = await userRepository.findOne({
        where: {
            tgId: ctx.session.tgId
        }
    })

    if (!user) {
        await ctx.reply('user undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    user.email = user.email + num
    await userRepository.save(user)

    await ctx.reply('Письма успешно выданы', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })

    return cancel(ctx)
})