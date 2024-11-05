"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('create-link leboncoin fr', handler);
const keyboard = new grammy_1.InlineKeyboard()
    .text('Назад', 'leboncoin fr menu');
async function handler(ctx) {
    return ctx.editMessageText(`
Для создания LEBONCOIN отправь эти данные одним сообщением:

<b>Страна (в формате двух букв: pt, us, es)
Название товара
Цена (с валютой)

Фото (сразу с текстом, одним сообщением)</b>
    `.replace('\n', ''), {
        reply_markup: keyboard
    });
}
exports.handler = handler;