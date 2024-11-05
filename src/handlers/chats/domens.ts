import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {getUsername} from "@/helpers/getUsername";
import {domensRepository, proDomensRepository, profitRepository, settingsRepository, userRepository} from "@/database";
import console from "console";
import {config} from "@/utils/config";
const request = require('request-promise')

export const composer = new Composer<Context>()
const regex = /^\/domens/gmi
composer.hears(regex, (ctx:Context) => checkKThandeler(ctx))

export async function checkKThandeler(ctx: Context, bot = undefined)  {
    try {
        if (ctx) {
            await ctx.deleteMessage()
        }
    } catch (e) {}
    const normDomens = await domensRepository.findOne({
        where: {
            active: true,
            service: 'ebay'
        }
    })

    const proDomen = await proDomensRepository.findOne({
        where: {
            active: true,
            service: 'ebay'
        }
    })

    if (!proDomen || !normDomens) return null

    const match = await checkDomensKT([normDomens.link,proDomen.link])

    let text = ``

    console.log(match)
    let main = false
    let pro = false
    if (match) {
        for (const obj of match) {
            if (obj?.threat?.url === normDomens.link && !main) {
                text += `\n❌❌[Обычный] AHTUNG ДОМЕН КТ ❌❌`
                main = true
            }
            if (obj?.threat?.url === proDomen.link && !pro) {
                text += `\n❌❌[PRO] AHTUNG ДОМЕН КТ ❌❌`
                pro = true
            }
        }
    }

    if (text) {
        text += `\n\nЗовем кодера @im_yupii !!!`
    } else {
        text = "🍀 Все домены прошли проверку на КТ!"
    }

    if (bot && text !== "🍀 Все домены прошли проверку на КТ!") {
        const setting = await settingsRepository.findOne({
            where: {
                id: 1
            }
        })
        if (setting.work) {
            await bot.api.sendMessage(config.chats.chat, text)
            return bot.api.sendMessage(config.chats.proChat, text)
        }
    }

    if (ctx) {
        return ctx.reply(text)
    }

}

export async function checkDomensKT(domens: string[]) {
    const recounstructDomens = []

    for (const obj of domens) {
        recounstructDomens.push({
            url: obj
        })
    }

    try {
        const response = await request.post(
            'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyAzARToy53Z35WcB-dgiZB_FqtvAFTbfF4',
            {
                json: true,
                headers: {
                    "Content-type": "application/json"
                },
                body: {
                    "client": {
                        "clientId":      "test",
                        "clientVersion": "1.5.2"
                    },
                    "threatInfo": {
                        "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING"],
                        "platformTypes":    ["WINDOWS"],
                        "threatEntryTypes": ["URL"],
                        "threatEntries": recounstructDomens
                    }
                },
            })
        if (response?.matches) return response?.matches
        console.log(response)
    } catch (e) {
        console.log(e)
    }

}