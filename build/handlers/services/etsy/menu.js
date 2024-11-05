"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getFlagEmoji_1 = require("../../../helpers/getFlagEmoji");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/etsy (?<country>\w+) menu/, handler);
async function handler(ctx) {
    const ads = await database_1.adsRepository.find({
        relations: { author: true },
        where: {
            delete: false,
            service: 'etsy',
            country: ctx.match[1],
            author: {
                tgId: ctx.user.tgId
            }
        },
    });
    await ctx.editMessageCaption({
        caption: `
<b>${(0, getFlagEmoji_1.getFlagEmoji)(ctx.match[1])} Количество обьявлений: <code>${ads.length}</code></b>
    `.replace('\n', ''),
        reply_markup: {
            inline_keyboard: [
                [{ text: '🦾 Создать вручную', callback_data: 'ad manual creation etsy ' + ctx.match[1] }],
                [{ text: 'Назад', callback_data: 'workMenu2.0' }]
            ]
        }
    });
}
