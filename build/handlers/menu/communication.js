"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('communication', callbackHandler);
function keyb() {
    return new grammy_1.InlineKeyboard()
        .text(`Назад`, 'useful');
}
const text = async (ctx) => {
    return `🐨 <a href="tg://user?id=5438664353">KOA</a> <b>или</b> <a href="tg://user?id=5604097517">Ricco</a>\n<b>🖥 Тех. проблемы: </b><a href="tg://user?id=5685044944">Йупи</a>`.replace('\n', '');
};
async function callbackHandler(ctx) {
    return ctx.editMessageCaption({
        caption: await text(ctx),
        reply_markup: keyb()
    });
}
