"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const getPictureMenu_1 = require("../../helpers/getPictureMenu");
const regex = /admin menu/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
exports.composer.callbackQuery(/adminMenuWithPicture/, handlerWithPicture);
async function handler(ctx) {
    return ctx.editMessageCaption({
        caption: '🐨 Админ-панель',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🍀 ВБИВЕРЫ', callback_data: 'admin vbivers menu' }],
                [{ text: '💌 Выдать SMS/EMAIL', callback_data: 'admin mailing menu' }],
                [{ text: '🐲 Наставники', callback_data: 'admin mentors menu' }, { text: '🐉 ТПшеры', callback_data: 'admin supports menu' }],
                [{ text: '🔋 FULL WORK', callback_data: 'admin work start' }, { text: '🪫 STOP WORK', callback_data: 'admin work stop' }],
                [{ text: '🤵 АФКшеры', callback_data: 'admin get afk user' }],
                [{ text: '🗯 Кастомная рассылка', callback_data: 'admin custom notification' }],
                [{ text: '🔗 Домены', callback_data: 'admin domen menu' }, { text: '👑 [PRO] Домены', callback_data: 'admin domenpro menu' }],
                [{ text: 'Назад', callback_data: 'menu' }]
            ]
        }
    });
}
async function handlerWithPicture(ctx) {
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: '🐨 Админ-панель',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🍀 ВБИВЕРЫ', callback_data: 'admin vbivers menu' }],
                [{ text: '💌 Выдать SMS/EMAIL', callback_data: 'admin mailing menu' }],
                [{ text: '🐲 Наставники', callback_data: 'admin mentors menu' }, { text: '🐉 ТПшеры', callback_data: 'admin supports menu' }],
                [{ text: '🔋 FULL WORK', callback_data: 'admin work start' }, { text: '🪫 STOP WORK', callback_data: 'admin work stop' }],
                [{ text: '🗯 Кастомная рассылка', callback_data: 'admin custom notification' }],
                [{ text: '🔗 Домены', callback_data: 'admin domen menu' }, { text: '👑 [PRO] Домены', callback_data: 'admin domen menu' }],
                [{ text: 'Назад', callback_data: 'menu' }]
            ]
        }
    });
}
