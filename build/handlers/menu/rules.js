"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('rules', callbackHandler);
function keyb() {
    return new grammy_1.InlineKeyboard()
        .text(`Назад`, 'useful');
}
const text = async (ctx) => {
    return `🐨 Тут будут правила KOA`.replace('\n', '');
};
async function callbackHandler(ctx) {
    return ctx.editMessageCaption({
        caption: await text(ctx),
        reply_markup: keyb()
    });
}
