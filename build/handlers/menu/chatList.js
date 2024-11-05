"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('useful url list for user', callbackHandler);
function keyb(isPro) {
    let keyb = new grammy_1.InlineKeyboard()
        .url(`⚠️ Канал уведомлений`, 'https://t.me/koa_notifications_robot')
        .row()
        .url(`❕ Выплаты`, 'https://t.me/+I3-jEK5WofEzMGJi')
        .url(`💬 Чат`, 'https://t.me/+h4cM0O9D89g5YzEy');
    if (isPro) {
        keyb
            .row()
            .url(`🐨 Чат [PRO]`, 'https://t.me/+45tu1EbZZ1QyN2My');
    }
    keyb
        .row()
        .text(`Назад`, 'useful');
    return keyb;
}
async function callbackHandler(ctx) {
    return ctx.editMessageCaption({
        // caption: await text(ctx),
        reply_markup: keyb(ctx.user.isPro)
    });
}
