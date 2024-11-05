import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {adsRepository, profilesRepository} from "@/database";
import {getService} from "@/helpers/getServices";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {getCountryByCountryCode} from "@/helpers/getCountryByCountryCode";

export const composer = new Composer<Context>()
const regex = /ad profile (?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('ad-set-profile')
}

export const scene = new Scene<Context>('ad-set-profile')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel ad-set-profile', cancel)

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []
    ctx.session.logId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const ad = await adsRepository.findOne({
        where: {
            id: ctx.session.logId
        }
    })

    if (!ad) {
        await ctx.scene.exit()
        return ctx.reply('ad undefined')
    }
    const service = getService(ad.service)
    const country = ad.country

    const keyboard = new InlineKeyboard()

    const profiles = await profilesRepository.find({
        relations: { user: true },
        where: {
            service: service.name,
            country: country,
            user: {
                tgId: ctx.user.tgId
            }
        }
    })
    if (profiles.length === 0) {
        return ctx.reply(`
<b>${getFlagEmoji(country)} ${service.name.toUpperCase()}</b>
Тут у тебя нет профилей`, {
            reply_markup: {
                inline_keyboard: [
                    // [{text: 'Создать', callback_data: 'adasdasd'}],
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }
    profiles.slice(0,9)
    for (const i in profiles) {
        const profile = profiles[i]
        if (i === '3' || i === '6' || i === '9') { keyboard.row() }
        keyboard.text(`${(profile.fullName.length > 9) ? profile.fullName.slice(0,9) + '...' : profile.fullName}`, `profile ${profile.id}`)
    }

    keyboard.row()
    keyboard.text(`Отмена`, `cancel ad-set-profile`)

    const response = await ctx.reply(`🐨 <b>Выбери профиль</b>`, {
        reply_markup: keyboard
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

scene.wait().callbackQuery(/^profile (?<id>\d+)$/gmi, async ctx => {
    ctx.session.deleteMessage.push(ctx.message.message_id)

    const ad = await adsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    })

    if (!ad) return ctx.reply(`ad undefined`)

    const profile = await profilesRepository.findOne({
        where: {
            id: Number(/^profile (?<id>\d+)$/gmi.exec(ctx.callbackQuery.data).groups.id)
        }
    })

    if (!profile) return ctx.reply(`profile undefined`)

    ad.profile = profile

    await adsRepository.save(ad)

    await ctx.reply(`✅ <b>Новый профиль</b> <code>${profile.fullName}</code>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})