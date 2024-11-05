"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('hide', settingsCallback);
async function settingsCallback(ctx) {
    ctx.user.hideUsername = !ctx.user.hideUsername;
    await database_1.userRepository.save(ctx.user);
    return ctx.editMessageCaption({
        caption: `
Ты <b>${(ctx.user.hideUsername) ? 'скрыл себя' : 'раскрыл себя'}</b>

⚠️ Твой ник теперь<b>${(ctx.user.hideUsername) ? ' НЕ' : ''}</b> будет виден в общем чате и выплатах!
`,
        reply_markup: {
            inline_keyboard: [
                [{ text: "Назад", callback_data: 'tag' }]
            ]
        }
    });
}
