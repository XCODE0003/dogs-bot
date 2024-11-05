"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const userEmails_1 = require("../../../handlers/private/lonelypups/userEmails");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/private lonelypups user email delete (?<id>\d+)/, handler);
async function handler(ctx) {
    const lonelyEmail = await database_1.lonelypupsRepository.findOne({
        where: { id: Number(ctx.match[1]) }
    });
    if (!lonelyEmail)
        return;
    await database_1.lonelypupsRepository.delete(lonelyEmail);
    await ctx.reply(`
✅ <b>Почта</b> <code>${lonelyEmail.email}</code> <b>была удалена</b>
        `, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }],
            ]
        }
    });
    return (0, userEmails_1.privateLonelyPupsUserEmail)(ctx);
}
exports.handler = handler;
