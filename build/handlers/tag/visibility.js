"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('tag change visibility', handler);
async function handler(ctx) {
    ctx.user.visibilityTag = !ctx.user.visibilityTag;
    await database_1.userRepository.save(ctx.user);
    return ctx.reply(`Теперь твой тег <b>${(ctx.user.visibilityTag) ? 'Виден другим' : 'НЕ виден другим'}</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }],
            ]
        }
    });
}
