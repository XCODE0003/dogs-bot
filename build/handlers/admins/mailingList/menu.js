"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const regex = /admin mailing menu/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    let text = `<code>/admin mailing {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`;
    return ctx.editMessageCaption({
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Назад', callback_data: 'admin menu' }]
            ]
        }
    });
}
