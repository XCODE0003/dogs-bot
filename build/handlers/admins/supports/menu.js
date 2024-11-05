"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportsMenu = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
const regex = /admin supports menu/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    let text = `🐉 ТПшеров в боте ${await database_1.supportsRepository.count()}`;
    text += `<code>\n\n/admin support {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`;
    return ctx.editMessageCaption({
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Список активных ТПшеров', callback_data: 'admin supports list on' }],
                [{ text: 'Список выкл ТПшеров', callback_data: 'admin supports list off' }],
                [{ text: 'Назад', callback_data: 'admin menu' }]
            ]
        }
    });
}
async function supportsMenu(ctx) {
    let text = `🐉 ТПшеров в боте ${await database_1.supportsRepository.count()}`;
    text += `<code>\n\n/admin support {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`;
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Список активных ТПшеров', callback_data: 'admin supports list on' }],
                [{ text: 'Список выкл ТПшеров', callback_data: 'admin supports list off' }],
                [{ text: 'Назад', callback_data: 'admin menu' }]
            ]
        }
    });
}
exports.supportsMenu = supportsMenu;
