"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/^ads delete all (question|true)/gmi, handler);
async function handler(ctx) {
    const match = /^ads delete all (question|true)/gmi.exec(ctx.callbackQuery.data);
    if (match[1] === 'question') {
        return ctx.reply(`⚠️ <b>Ты действительно хочешь удалить все обьявления?</b>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🐾 Удалить', callback_data: ctx.callbackQuery.data.replace('question', 'true') }],
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    const ads = await database_1.adsRepository.find({
        relations: ['author'],
        where: {
            delete: false,
            author: {
                tgId: ctx.user.tgId
            }
        }
    });
    for (const i in ads) {
        ads[i].delete = true;
        ads[i].page = '0';
        ads[i].pageMobile = '0';
    }
    await database_1.adsRepository.save(ads);
    return ctx.reply(`🐾 Удалено ${ads.length}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
exports.handler = handler;
