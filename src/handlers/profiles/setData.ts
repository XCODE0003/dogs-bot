import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {profilesRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /profile set (?<data>\w+) (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    const match = regex.exec(ctx.match[0])
    const data = match.groups.data
    const id = Number(match.groups.id)

    return ctx.scenes.enter('profiles-set-data', {
        data, id
    })
}

export const setProfileData = new Scene<Context>('profiles-set-data')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

setProfileData.always().callbackQuery('cancel profiles-set-data', cancel)

setProfileData.do(async ctx => {
    ctx.session.deleteMessage = []
    let name = undefined

    if (ctx.scene.opts.arg.data === 'fullname') {
        name = "<b>Фио</b>"
    } else if (ctx.scene.opts.arg.data === 'delivery') {
        name = "<b>Доставка</b>"
    } else if (ctx.scene.opts.arg.data === 'phone') {
        name = "<b>Номер телефона</b>"
    }
    const response = await ctx.reply(`Введи новое значение для ${name}`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: "cancel profiles-set-data"}]
            ]
        }
    })
    ctx.session.profile = ctx.scene.opts.arg
    ctx.session.deleteMessage.push(response.message_id)
})

setProfileData.wait().on('message:text', async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)

    const profile = await profilesRepository.findOne({
        where: {
            id: ctx.session.profile.id
        }
    })

    if (!profile) {
        await cancel(ctx)
        return  ctx.reply(`Профиль не найден`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: "deleteThisMessage"}]
                ]
            }
        })
    }

    switch (ctx.session.profile.data) {
        case 'phone':
            profile.phone = ctx.message.text
            break

        case 'fullname':
            profile.fullName = ctx.message.text
            break

        case 'delivery':
            profile.delivery = ctx.message.text
            break

        default:
            await cancel(ctx)
            return ctx.reply(`Неизвестная ошибка \n\n${JSON.stringify(ctx.session.profile)}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: "deleteThisMessage"}]
                    ]
                }
            })
    }

    await profilesRepository.save(profile)

    await cancel(ctx)
    return ctx.reply(`Данные успешно изменены`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: "deleteThisMessage"}]
            ]
        }
    })
})

