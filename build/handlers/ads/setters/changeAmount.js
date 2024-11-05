"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const database_1 = require("../../../database");
exports.composer = new grammy_1.Composer();
const regex = /ad amount (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('ad-set-amount');
}
exports.scene = new grammy_scenes_1.Scene('ad-set-amount');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel ad-set-amount', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const response = await ctx.reply(`🪵 <b>Введите новую цену</b>\n<code>Пример: 23.99</code>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel ad-set-amount' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/(^\d+\.\d\d)|(^\d+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    const ad = await database_1.adsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    });
    if (!ad)
        return ctx.reply(`ad undefined`);
    let currency = "€";
    if (ad.service === 'facebook')
        currency = 'Kč';
    ad.price = (parseFloat(ctx.match[0])).toFixed(2) + ` ${currency}`;
    await database_1.adsRepository.save(ad);
    await ctx.reply(`✅ <b>Новая цена</b> <code>${ad.price}</code>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
