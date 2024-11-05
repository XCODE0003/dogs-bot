import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {mentorsRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import {Mentors} from "@/database/models/mentors";

export const composer = new Composer<Context>()
const regex = /admin mentor create (?<tgid>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    const match = regex.exec(ctx.callbackQuery.data)
    if (match?.groups?.tgid) {
        return ctx.scenes.enter('mentors-add', match?.groups?.tgid)
    }
}

export const addMentorScene = new Scene<Context>('mentors-add')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

addMentorScene.always().callbackQuery('cancel mentors-add', cancel)

addMentorScene.use(async (ctx, next) => {
    ctx.session.tgId = ctx.scene.opts.arg
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(ctx.callbackQuery.message.message_id)
    ctx.deleteMessage()
    const mentor = await mentorsRepository.findOne({
        relations: { user: true },
        where: {
            user: {
                tgId: ctx.session.tgId
            }
        }
    })

    if (mentor) {
        await ctx.editMessageText(`
Наставник уже сущестувет
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return ctx.scene.exit()
    }

    const user = await userRepository.findOne({
        where: {
            tgId: ctx.session.tgId
        }
    })

    if (!user) {
        await ctx.editMessageText(`
Пользователь не зарегестрирован в боте
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return ctx.scene.exit()
    }

    ctx.session.mentors = {description: undefined, percent: undefined, freedom: undefined}
    return next()
})

addMentorScene.do(async (ctx) => {
    ctx.session.mentors = {description: undefined, percent: undefined, freedom: undefined}

    ctx.session.deleteMessage = []
    const response = await ctx.reply(`Введите описание для этого наставника`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel mentors-add'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

addMentorScene.wait().on("message:text",async (ctx) => {
    ctx.session.mentors.description = ctx.msg.text
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    const response = await ctx.reply(`Введите процент который будет получать наставник`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel mentors-add'}]
            ]
        }
    })

    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

addMentorScene.wait().hears(/^\d\d|^\d/, async (ctx,next) => {
    ctx.session.mentors.percent = Number(ctx.match[0])
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    const response = await ctx.reply(`Введите через сколько профитов, ученик сможет уйти`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel mentors-add'}]
            ]
        }
    })

    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

addMentorScene.wait().hears(/(^\d)/, async (ctx,next) => {
    ctx.session.mentors.freedom = Number(/(^\d)/.exec(ctx.msg.text)[1])
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    const user = await userRepository.findOne({
        where: {
            tgId: ctx.session.tgId
        }
    })
    const response = await ctx.reply(`Наставник ${await getUsername(user, true)}\nПроцент: ${ctx.session.mentors.percent}%\nПрофит: ${ctx.session.mentors.freedom}\n\n${ctx.session.mentors.description}`, {
        reply_markup: {
            inline_keyboard: [
                [{text: '👍 Добавить', callback_data: 'scene mentor accept'}],
                [{text: 'Отмена', callback_data: 'cancel mentors-add'}]
            ]
        }
    })

    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})


addMentorScene.wait().callbackQuery(/scene mentor accept/, async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)

    const user = await userRepository.findOne({ where: {tgId: ctx.session.tgId} })
    const newMentor = new Mentors()

    newMentor.description = ctx.session.mentors.description
    newMentor.percent = ctx.session.mentors.percent
    newMentor.user = user
    newMentor.freedom = ctx.session.mentors.freedom
    newMentor.active = true

    await mentorsRepository.save(newMentor)

    await ctx.reply('Наставник успешно создан', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    ctx.scene.exit()
})