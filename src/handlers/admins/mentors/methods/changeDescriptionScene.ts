import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {mentorsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /mentor change description (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('mentor-change-description')
}

export const mentorChangeDesc = new Scene<Context>('mentor-change-description')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

mentorChangeDesc.always().callbackQuery('cancel mentor-change-description', cancel)

mentorChangeDesc.do(async (ctx) => {
    ctx.session.mentors = {description: undefined, percent: undefined}
    ctx.session.deleteMessage = []
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const response = await ctx.reply(`Введите новое описание для этого наставника`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel mentor-change-description'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

mentorChangeDesc.wait().on('message:text', async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)
    ctx.session.mentors.description = ctx.message.text

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

    mentor.description = ctx.session.mentors.description
    await mentorsRepository.save(mentor)

    await ctx.reply('Описание успешно изменено', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})