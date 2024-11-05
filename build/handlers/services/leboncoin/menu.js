"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('leboncoin fr menu', handler);
async function handler(ctx) {
    const ads = await database_1.adsRepository.find({
        relations: { author: true },
        where: {
            delete: false,
            service: 'leboncoin',
            country: 'fr',
            author: {
                tgId: ctx.user.tgId
            }
        },
    });
    await ctx.editMessageCaption({
        caption: `
<b>🙊 Количество обьявлений: <code>${ads.length}</code></b>
    `.replace('\n', ''),
        reply_markup: {
            inline_keyboard: [
                [{ text: '🦾 Создать вручную', callback_data: 'ad manual creation leboncoin-fr' }],
                [{ text: 'Назад', callback_data: 'workMenu2.0' }]
            ]
        }
    });
}
