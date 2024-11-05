"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('private menu lonelypups', handler);
const keyboard = new grammy_1.InlineKeyboard()
    .text('📦 Мои почты', 'private lonelypups user emails')
    .row()
    .text('💌 Отправить письмо', 'private lonelypups send email')
    .row()
    .text('Назад', 'menu'); // asdфівфів
async function handler(ctx) {
    return ctx.editMessageCaption({
        // caption: 'Профиль для создания обьявлений, тд тп...',
        reply_markup: keyboard
    });
}
exports.handler = handler;
