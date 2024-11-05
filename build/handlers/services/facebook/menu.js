"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('facebook cz menu', handler);
async function handler(ctx) {
    const ads = await database_1.adsRepository.find({
        relations: { author: true },
        where: {
            delete: false,
            service: 'facebook',
            country: 'cz',
            author: {
                tgId: ctx.user.tgId
            }
        },
    });
    await ctx.editMessageCaption({
        caption: `
<b>Количество обьявлений: <code>${ads.length}</code></b>

<b>⚠️ Ты можешь посмотреть только последние 20 обьявлений.</b>
    `.replace('\n', ''),
        reply_markup: {
            inline_keyboard: [
                [{ text: '🏷 Список', callback_data: 'facebook cz list' }],
                // [{text: '🦾 Создать вручную', callback_data: 'ad manual creation ebay-de'}],
                [{ text: 'Удалить все', callback_data: 'ads delete all question' }],
                [{ text: 'Назад', callback_data: 'facebook' }]
            ]
        }
    });
}
