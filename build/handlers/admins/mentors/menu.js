"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorsMenu = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
const regex = /admin mentors menu/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    let text = `🐲 Наставников в боте ${await database_1.mentorsRepository.count()}`;
    text += `<code>\n\n/admin mentor {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`;
    return ctx.editMessageCaption({
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Список активных менторов', callback_data: 'admin mentors list on' }],
                [{ text: 'Список выкл менторов', callback_data: 'admin mentors list off' }],
                [{ text: 'Назад', callback_data: 'admin menu' }]
            ]
        }
    });
}
async function mentorsMenu(ctx) {
    let text = `🐲 Наставников в боте ${await database_1.mentorsRepository.count()}`;
    text += `<code>\n\n/admin mentor {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`;
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Список активных менторов', callback_data: 'admin mentors list on' }],
                [{ text: 'Список выкл менторов', callback_data: 'admin mentors list off' }],
                [{ text: 'Назад', callback_data: 'admin menu' }]
            ]
        }
    });
}
exports.mentorsMenu = mentorsMenu;
