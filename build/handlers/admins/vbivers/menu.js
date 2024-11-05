"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vbiverMenu = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const user_1 = require("../../../database/models/user");
const regex = /admin vbivers menu/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const vbiversCount = await database_1.userRepository.find({
        where: {
            role: user_1.UserRole.VBIVER
        }
    });
    let text = `🧞 Вбиверов: ${vbiversCount.length}`;
    text += `<code>\n\n/admin vbiver {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`;
    return ctx.editMessageCaption({
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Список', callback_data: 'admin vbiver list' }],
                [{ text: 'Назад', callback_data: 'admin menu' }]
            ]
        }
    });
}
async function vbiverMenu(ctx) {
    const vbiversCount = await database_1.userRepository.find({
        where: {
            role: user_1.UserRole.VBIVER
        }
    });
    let text = `🧞 Вбиверов: ${vbiversCount.length}`;
    text += `<code>\n\n/admin vbiver {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`;
    return ctx.editMessageCaption({
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Список', callback_data: 'admin vbiver list' }],
                [{ text: 'Назад', callback_data: 'admin menu' }]
            ]
        }
    });
}
exports.vbiverMenu = vbiverMenu;
