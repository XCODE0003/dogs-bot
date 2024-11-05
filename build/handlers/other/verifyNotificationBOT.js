"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const bot_1 = require("../../utils/bot");
const regex = /^verify notificationbot/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    try {
        bot_1.notificationBot.api.getChat(ctx.user.tgId)
            .then(() => {
            return ctx.editMessageText('🌱 Ты успешно запустили бота', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
                    ]
                }
            });
        })
            .catch(() => {
            return ctx.answerCallbackQuery({
                text: '⚠️ Ты не запустил бота',
                show_alert: true
            });
        });
    }
    catch (e) {
        console.log(e);
        return ctx.answerCallbackQuery({
            text: '⚠️ Ты не запустил бота',
            show_alert: true
        });
    }
}
