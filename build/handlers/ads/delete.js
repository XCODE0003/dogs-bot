"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/^ad delete (?<id>\d+)/gmi, handler);
async function handler(ctx) {
    const match = /^ad delete (?<id>\d+)/gmi.exec(ctx.callbackQuery.data);
    const ad = await database_1.adsRepository.findOne({
        where: {
            id: Number(match.groups.id)
        }
    });
    if (!ad)
        return ctx.reply('ad undefined');
    ad.page = '0';
    ad.pageMobile = '0';
    ad.delete = true;
    await database_1.adsRepository.save(ad);
    // try {
    //     ctx.deleteMessage()
    // }catch (e) {}
    return ctx.reply('✅ Обьявление успешно удалено', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
exports.handler = handler;
