import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {getService, serviceList} from "@/helpers/getServices";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {getCountryByCountryCode} from "@/helpers/getCountryByCountryCode";
import {profilesRepository} from "@/database";

export const composer = new Composer<Context>()
const regexService = /^profiles list (?<service>.+)$/gmi
const regexCountry = /^profiles list (?<service>.+) (?<country>.+)$/gmi
composer.callbackQuery(/^profiles list$/gmi, service)
composer.callbackQuery(regexCountry, list)
composer.callbackQuery(regexService, serviceCountry)

async function service(ctx: Context)  {

    const keyboard = new InlineKeyboard()

    for (const i in serviceList) {
        const service = serviceList[i]
        if (service.profile) {
            if (i === '2' || i === '4' || i === '6') {
                keyboard.row()
            }
            keyboard.text(service.name.toUpperCase(), `profiles list ${service.name}`)
        }
    }

    keyboard.row()
    keyboard.text('Назад',`profiles menu`)

    return ctx.editMessageCaption({
        caption: '<b>Выбери платформу:</b>',
        reply_markup: keyboard
    })
}

async function serviceCountry(ctx: Context)  {
    const match = regexService.exec(ctx.callbackQuery.data)
    const service = getService(match.groups.service)

    const keyboard = new InlineKeyboard()

    for (const i in service.country) {
        const countryCode = service.country[i]
        if (i === '2' || i === '4' || i === '6') { keyboard.row() }
        keyboard.text(`${getFlagEmoji(countryCode)} ${getCountryByCountryCode(countryCode)}`,`profiles list ${service.name} ${countryCode}`)
    }

    keyboard.row()
    keyboard.text(`Назад`,`profiles list`)

    return ctx.editMessageCaption({
        caption: '<b>Выбери страну:</b>',
        reply_markup: keyboard
    })
}

async function list(ctx: Context)  {
    const match = regexCountry.exec(ctx.callbackQuery.data)
    const service = getService(match.groups.service)
    const country = match.groups.country

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
        keyboard.text(`${(profile.fullName.length > 9) ? profile.fullName.slice(0,9) + '...' : profile.fullName}`, `profiles info ${profile.id}`)
    }

    keyboard.row()
    keyboard.text(`Закрыть`, `deleteThisMessage`)

    return ctx.reply(`<b>${getFlagEmoji(country)} ${service.name.toUpperCase()}</b>`, {
        reply_markup: keyboard
    })
}