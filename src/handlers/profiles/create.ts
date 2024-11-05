import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard, InputFile} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {Profiles} from "@/database/models/profiles";
import {profilesRepository} from "@/database";
import {getService, serviceList} from "@/helpers/getServices";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {getCountryByCountryCode} from "@/helpers/getCountryByCountryCode";

export const composer = new Composer<Context>()
const regex = /^profiles create$/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    const match = regex.exec(ctx.match[0])
    // if (match?.groups?.service) {
    //     return ctx.scenes.enter('profiles-create', match?.groups?.service)
    // }

    return ctx.scenes.enter('profiles-create', undefined)
}

export const profilesCreateScene = new Scene<Context>('profiles-create')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

profilesCreateScene.always().callbackQuery('cancel profiles-create', cancel)

profilesCreateScene.use(async (ctx, next) => {
    ctx.session.profiles = { country: undefined, fullName: undefined, service: undefined,delivery: undefined,phone: undefined}

    if (ctx.scene.opts.arg) {
        // ctx.session.profiles.service = ctx.scene.opts.arg
        return next()
    }

    return next()
})

profilesCreateScene.use(async (ctx,next) => {
    if (true) {
        const keyboard = new InlineKeyboard()

        for (const i in serviceList) {
            const service = serviceList[i]
            if (service.profile) {
                if (i === '2' || i === '4' || i === '6') { keyboard.row() }
                keyboard.text(service.name.toUpperCase(),`profiles scene service ${service.name}`)
            }
        }

        keyboard.row()
        keyboard.text('Отмена',`cancel profiles-create`)

        const response = await ctx.reply(`Выбери платформу:`, {
            reply_markup: keyboard
        })

        ctx.session.deleteMessage = [response.message_id]
        return next()
    }else {
        const response = await ctx.reply('Платформа выбрана автоматически <code>[EBAY]</code>', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Дальше', callback_data: 'profiles scene service auto'}]
                ]
            }
        })
        ctx.session.deleteMessage = [response.message_id]
        return next()
    }
})

profilesCreateScene.wait().callbackQuery(/^profiles scene service\s+(?<service>\w+)$/gmi,async (ctx) => {
    const match = /profiles scene service\s+(?<service>\w+)/gmi.exec(ctx.callbackQuery.data)
    const serviceName = match?.groups?.service

    if (serviceName !== 'auto') ctx.session.profiles.service = serviceName

    const keyboard = new InlineKeyboard()
    const service = getService(match.groups.service)

    for (const i in service.country) {
        const countryCode = service.country[i]
        if (i === '2' || i === '4' || i === '6') { keyboard.row() }
        keyboard.text(`${getFlagEmoji(countryCode)} ${getCountryByCountryCode(countryCode)}`,`profiles scene country ${countryCode}`)
    }

    keyboard.row()
    keyboard.text(`Отмена`,`cancel profiles-create`)


    await ctx.editMessageText(`Выбери страну`, {
        reply_markup: keyboard
    })

    // await ctx.editMessageText(`Введите ФИО`, {
    //     reply_markup: {
    //         inline_keyboard: [
    //             [{text: "Отмена", callback_data: "cancel profiles-create"}]
    //         ]
    //     }
    // })
    ctx.scene.resume()
})

profilesCreateScene.wait().callbackQuery(/^profiles scene country\s+(?<country>\w+)$/gmi,async (ctx) => {
    const match = /profiles scene country\s+(?<country>\w+)/gmi.exec(ctx.callbackQuery.data)
    if (!match?.groups?.country) return console.log('охьебать ошибка regex нахуй')
    ctx.session.profiles.country = match?.groups?.country

    await ctx.editMessageText(`Введи ФИО`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Отмена", callback_data: "cancel profiles-create"}]
            ]
        }
    })
    ctx.scene.resume()
})

profilesCreateScene.wait().on("message:text",async (ctx) => {
    const response = await ctx.reply("Напиши адрес доставки", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Отмена", callback_data: "cancel profiles-create"}]
            ]
        }
    })

    ctx.session.deleteMessage.push(ctx.message.message_id)
    ctx.session.profiles.fullName = ctx.msg.text
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

profilesCreateScene.wait().on("message:text",async (ctx) => {
    const response = await ctx.reply("Напиши номер телефона", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Отмена", callback_data: "cancel profiles-create"}]
            ]
        }
    })

    ctx.session.deleteMessage.push(ctx.message.message_id)
    ctx.session.profiles.delivery = ctx.msg.text
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

// profi esCreateScene.wait().on('message:photo', async ctx => {
//     const res = await ctx.getFile()
//
//     if (!res) {
//         await ctx.reply('Не найдено фото, попробуй еще раз', {
//             reply_markup:  new InlineKeyboard()
//                 .text('Отмена', 'cancel profiles-create')
//
//         })
//         return ctx.scene.exit()
//     }
//
//     ctx.session.profiles.avatar = res.file_path
//     ctx.scene.resume()
// })

// profilesCreateScene.label('skipAvatar')
profilesCreateScene.wait().on('message:text',async (ctx) => {
    ctx.session.profiles.phone = ctx.msg.text

    const profiles = await profilesRepository.find({
        relations: {user: true},
        where: {
            country: ctx.session.profiles.country,
            service: ctx.session.profiles.service,
            user: {
                tgId: ctx.user.tgId
            }
        }
    })

    if (profiles.length > 10) {
        await ctx.reply(`⚠️ <b>Нельзя создавать больше десяти профилей на одной площадке в одной стране</b>`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }

    const profile = new Profiles()
    profile.service = ctx.session.profiles.service
    profile.phone = ctx.session.profiles.phone
    profile.delivery = ctx.session.profiles.delivery
    profile.fullName = ctx.session.profiles.fullName
    profile.avatar = ctx.session.profiles.avatar
    profile.country = ctx.session.profiles.country
    profile.user = ctx.user
    await profilesRepository.save(profile)

    let text = ''
    text += `<b>${getFlagEmoji(ctx.session.profiles.country)} ${ctx.session.profiles.service.toUpperCase()}</b>`
    text += `\n\n👤 ФИО: <code>${ctx.session.profiles.fullName}</code>`
    text += `\n🏘 Доставка: <code>${ctx.session.profiles.delivery}</code>`
    text += `\n📲 Номер: <code>${ctx.session.profiles.phone}</code>`

    await ctx.reply(text, {
        reply_markup: {
            inline_keyboard: [
                // [{text: "Использовать этот профиль", callback_data: `ad create with profile ${profile.id}`}],
                [{text: "Закрыть", callback_data: "deleteThisMessage"}]
            ]
        }
    })
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
})