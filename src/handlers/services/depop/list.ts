import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import moment from "moment/moment";
import {ebayMenu} from "@/handlers/services/ebay/index";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";

export const composer = new Composer<Context>()
composer.callbackQuery('depop de list', handler)

export async function handler(ctx: Context)  {
    const ads = await adsRepository.find({
        relations: {author: true},
        where: {
            service: 'depop',
            country: 'de',
            delete: false,
            author: {
                tgId: ctx.user.tgId
            }
        },
    })

    if (ads.length > 20) ads.slice(ads.length - 20, ads.length)

    if (ads.length === 0) {
        return ctx.reply('У вас 0 обьявлений', {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Закрыть", callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    const domen = await domensRepository.findOne({
        where: {
            active: true,
            service: ads[0].service
        }
    })



    for (const ad of ads) {
        const keyb =  [
                // [{text: 'Настройки', callback_data: `settings ad ${ad.id}`}]
            ]

        if (ctx.user.sms > 0) {
            keyb.push([{text: '📲 SMS', callback_data: `sms ad ${ad.id}`}])
        }

        if (ctx.user.email > 0) {
            keyb.push([{text: '💌 EMAIL', callback_data: `email ad ${ad.id}`}])
        }

        keyb.push([{text: '⚙ Настройки', callback_data: `settings ad ${ad.id}`}])


        await ctx.reply(`
🐨 ID объявления: <code>${ad.date}</code>

🌳 <b>Название:</b> <code>${ad.title}</code>
🌳 <b>Цена:</b> <code>${ad.price}</code>
🌳 <b>Платформа: ${ad.service.toUpperCase()} [${ad.country.toUpperCase()} ${getFlagEmoji(ad.country)}]</b>
♻️ <b>Домен сменён ${moment(domen.dateChange).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>FACEBOOK:</b> <a href="https://${domen.link}/link/${ad.link}">LINK [2.0]</a>

🚚 <b>DPD:</b> <a href="https://${domen.link}/service/dpd/${ad.link}">DPD LINK</a>
🚚 <b>PACKETA:</b> <a href="https://${domen.link}/service/packeta/${ad.link}">PACEKTA LINK</a>
🚚 <b>DHL:</b> <a href="https://${domen.link}/service/dhl/${ad.link}">DHL LINK</a>

`, {
            reply_markup: {
                inline_keyboard: keyb
            }
        })
        await new Promise((resolve) => setTimeout(resolve, 1000 * 0.25))
    }

}