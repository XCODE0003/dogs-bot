import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {find} from "cheerio/lib/api/traversing";
import {domensRepository, proDomensRepository} from "@/database";
import {Domens} from "@/database/models/domens";
import console from "console";

const regex = /^admin domenpro service (?<service>\w+)$/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const service = match.groups.service

    const domens = await proDomensRepository.find({
        where: {
            service
        }
    })

    let nowDomen: Domens = undefined
    for (let d of domens) if (d.active) nowDomen = d;

    let text = `<code>${service.toUpperCase()}</code>`
    text += `\n\n<b>Текущий домен <code>${nowDomen?.link}</code></b>`

    const markup = []

    for (const domen of domens) {
        if (!domen.active) {
            markup.push([{text: `${(domen.wasUsed) ? '❌' : '♻️'} ${domen.link}`, callback_data: `admin domenpro service ${domen.service} set ${domen.id}`}])
        }
    }

    markup.push([{text: 'Назад', callback_data: `admin domenpro menu`}])

    return ctx.editMessageCaption( {
        caption: text,
        reply_markup: {
            inline_keyboard: markup
        }
    })
}