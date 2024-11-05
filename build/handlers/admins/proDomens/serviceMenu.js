"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const regex = /^admin domenpro service (?<service>\w+)$/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const service = match.groups.service;
    const domens = await database_1.proDomensRepository.find({
        where: {
            service
        }
    });
    let nowDomen = undefined;
    for (let d of domens)
        if (d.active)
            nowDomen = d;
    let text = `<code>${service.toUpperCase()}</code>`;
    text += `\n\n<b>Текущий домен <code>${nowDomen?.link}</code></b>`;
    const markup = [];
    for (const domen of domens) {
        if (!domen.active) {
            markup.push([{ text: `${(domen.wasUsed) ? '❌' : '♻️'} ${domen.link}`, callback_data: `admin domenpro service ${domen.service} set ${domen.id}` }]);
        }
    }
    markup.push([{ text: 'Назад', callback_data: `admin domenpro menu` }]);
    return ctx.editMessageCaption({
        caption: text,
        reply_markup: {
            inline_keyboard: markup
        }
    });
}
