"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ebayMenu = exports.composer = void 0;
const grammy_1 = require("grammy");
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('depop', handler);
const keyboard = new grammy_1.InlineKeyboard()
    .text('🇩🇪 Германия', 'aaaaa')
    .text('🇬🇧 Великобритания', 'aaaaa')
    .text('🇦🇺 Австралия', 'aaaaaa')
    .row()
    .text('Назад', 'workMenu');
async function handler(ctx) {
    return ctx.editMessageCaption({
        caption: `<b>🍀 Чтобы создать ссылку, отправь ссылку на товар боту и он все сделает автоматически или нажми "Создать вручную", чтобы создать кастомное объявление.</b>`,
        reply_markup: keyboard
    });
}
async function ebayMenu(ctx) {
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: `
<b>⭐️ Ссылки VINTED создаются просто отправкой.
Отправь ссылку и бот сделает всё сам</b>
    `.replace('\n', ''),
        reply_markup: keyboard
    });
}
exports.ebayMenu = ebayMenu;
