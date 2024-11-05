"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/private lonelypups emailInfo (?<id>\d+)/, handler);
async function handler(ctx) {
    const lonelyEmail = await database_1.lonelypupsRepository.findOne({
        where: { id: Number(ctx.match[1]) }
    });
    if (!lonelyEmail)
        return;
    return ctx.editMessageCaption({
        caption: `
📧 <b>Почта:</b> <code>${lonelyEmail.email}</code>
🧢 <b>Цена:</b> <code>${lonelyEmail.deliveryPrice} €</code>
        `,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Удалить', callback_data: `private lonelypups user email delete ${lonelyEmail.id}` }],
                [{ text: 'Сменить цену', callback_data: `private lonelypups set amount ${lonelyEmail.id}` }],
                [{ text: 'Назад', callback_data: 'private lonelypups user emails' }],
            ]
        }
    });
}
exports.handler = handler;
