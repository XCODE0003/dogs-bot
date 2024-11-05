"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('tag', handler);
async function handler(ctx) {
    let text = `🏷 Твой тэг: <b>#${ctx.user.tag}</b>`;
    return ctx.editMessageCaption({
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: `${(ctx.user.visibilityTag) ? '🐾 Выключить тэг' : '🏷 Включить тэг'}`, callback_data: 'tag change visibility' }],
                [{ text: '📝 Установить ТЕГ', callback_data: 'tag change' }],
                [{ text: `${(ctx.user.hideUsername) ? 'Раскрыть себя' : 'скрыть себя'}`, callback_data: 'hide' }],
                [{ text: 'Назад', callback_data: 'menu' }]
            ]
        }
    });
}
