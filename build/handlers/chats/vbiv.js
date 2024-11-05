"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const getUsername_1 = require("../../helpers/getUsername");
const database_1 = require("../../database");
const user_1 = require("../../database/models/user");
exports.composer = new grammy_1.Composer();
const regex = /^\/vbiv/gmi;
exports.composer.hears(regex, handler);
exports.composer.callbackQuery('vbiv', handler);
async function handler(ctx) {
    if (!ctx.callbackQuery) {
        try {
            ctx.deleteMessage();
        }
        catch (e) {
        }
    }
    const vbivers = await database_1.userRepository.find({
        where: {
            naVbive: true,
            role: user_1.UserRole.VBIVER
        }
    });
    let text = `💳 Сейчас на вбиве\n`;
    for (const vbiver of vbivers) {
        text += `\n🪆 <b>${await (0, getUsername_1.getUsername)(vbiver)}</b>`;
    }
    return ctx.reply(text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
