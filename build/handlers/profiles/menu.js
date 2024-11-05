"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('profiles menu', handler);
const keyboard = new grammy_1.InlineKeyboard()
    .text('🙊 Создать профиль', 'profiles create')
    .row()
    .text('📜 Список моих профилей', 'profiles list')
    .row()
    .text('Назад', 'workMenu2.0');
async function handler(ctx) {
    return ctx.editMessageCaption({
        // caption: 'Профиль для создания обьявлений, тд тп...',
        reply_markup: keyboard
    });
}
exports.handler = handler;
