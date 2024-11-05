import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {mentorsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /mentor change percent (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    console.log('asd')
    return ctx.scenes.enter('mentor-change-percent')
}

export const changePercentScene = new Scene<Context>('mentor-change-percent')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

changePercentScene.always().callbackQuery('cancel mentor-change-percent', cancel)

changePercentScene.do(async (ctx) => {
    ctx.session.mentors = {description: undefined, percent: undefined}
    ctx.session.deleteMessage = []
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const response = await ctx.reply(`Введите новый процент для этого наставника`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel mentor-change-percent'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

changePercentScene.wait().hears(/^\d\d|^\d/gmi, async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)
    ctx.session.mentors.percent = Number(ctx.match[0])

    const mentor = await mentorsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    })

    if (!mentor) {
        await ctx.reply('Mentor undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    mentor.percent = ctx.session.mentors.percent
    await mentorsRepository.save(mentor)

    await ctx.reply('Процент успешно изменен', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})