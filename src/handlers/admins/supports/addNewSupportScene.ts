// @ts-nocheck
import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {mentorsRepository, supportsRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import {Mentors} from "@/database/models/mentors";
import {Supports} from "@/database/models/supports";

export const composer = new Composer<Context>()
const regex = /admin support create (?<tgid>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    const match = regex.exec(ctx.callbackQuery.data)
    if (match?.groups?.tgid) {
        return ctx.scenes.enter('support-add', match?.groups?.tgid)
    }
}

export const addSupportScene = new Scene<Context>('support-add')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

addSupportScene.always().callbackQuery('cancel support-add', cancel)

addSupportScene.use(async (ctx, next) => {
    ctx.session.tgId = ctx.scene.opts.arg
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(ctx.callbackQuery.message.message_id)
    ctx.deleteMessage()
    const mentor = await supportsRepository.findOne({
        relations: { user: true },
        where: {
            user: {
                tgId: ctx.session.tgId
            }
        }
    })

    if (mentor) {
        await ctx.editMessageText(`
ТПшер уже сущестувет
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

    ctx.session.supports = {percent: undefined, code: undefined, description: undefined}
    ctx.session.deleteMessage = []
    return next()
})

addSupportScene.do(async (ctx) => {
    const response = await ctx.reply(`Введите процент ТПшера`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel support-add'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

addSupportScene.wait().hears(/(^\d\d)|(^\d)/,async (ctx) => {
    ctx.session.supports.percent = Number(ctx.match[0])
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    const response = await ctx.reply(`Введите описание`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel support-add'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

addSupportScene.wait().on('message:text',async (ctx) => {
    ctx.session.supports.description = ctx.msg.text
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    const response = await ctx.reply(`Введите код`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel support-add'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

addSupportScene.wait().on('message:text',async (ctx) => {
    ctx.session.supports.code = ctx.msg.text
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    console.log(ctx.session.supports)
    const user = await userRepository.findOne({ where: {tgId: ctx.session.tgId} })
    const newSupport = new Supports()
    newSupport.code = ctx.session.supports.code
    newSupport.percent = ctx.session.supports.percent
    newSupport.description = ctx.session.supports.description
    newSupport.user = user

    await supportsRepository.save(newSupport)
    user.supportUser = newSupport
    user.supportCode = ''
    await userRepository.save(user)

    await ctx.reply(`ТПшер успешно добавлен`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })

    return cancel(ctx)
})