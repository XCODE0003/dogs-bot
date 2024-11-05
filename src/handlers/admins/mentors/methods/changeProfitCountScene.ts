import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {mentorsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /mentor change profitCount (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('mentor-change-profitCount')
}

export const mentorChangePofitCount = new Scene<Context>('mentor-change-profitCount')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

mentorChangePofitCount.always().callbackQuery('cancel mentor-change-profitCount', cancel)

mentorChangePofitCount.do(async (ctx) => {
    ctx.session.mentors = {description: undefined, percent: undefined}
    ctx.session.deleteMessage = []
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const response = await ctx.reply(`🐨 Введите нужное кол-во профитов:`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel mentor-change-profitCount'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

mentorChangePofitCount.wait().hears(/(^\d+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)
    ctx.session.mentors.freedom = Number(/(^\d+)/.exec(ctx.msg.text)[1])

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

    mentor.freedom = ctx.session.mentors.freedom
    await mentorsRepository.save(mentor)

    await ctx.reply('Кол-во профитов успешно изменено', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})