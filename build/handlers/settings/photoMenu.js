"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('photoMenu', settingsCallback);
async function settingsCallback(ctx) {
    return ctx.editMessageCaption({
        caption: ``,
        reply_markup: {
            inline_keyboard: [
                [{ text: "Установить свое фото", callback_data: 'setPhotoMenu' }],
                [{ text: "Поставить наше фото", callback_data: 'setPhotoMenu default' }],
                [{ text: "Назад", callback_data: 'settings' }]
            ]
        }
    });
}
