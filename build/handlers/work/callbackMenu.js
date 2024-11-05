"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('workMenu2.0', handler);
exports.composer.callbackQuery('no-auto-create-answer', callbackAnswer);
exports.composer.command('workMenu', handler);
const keyboard = new grammy_1.InlineKeyboard()
    .text('Профили', 'profiles menu')
    .row()
    .text('🇩🇪 Германия', 'workMenu de')
    .text('🇫🇷 Франция', 'workMenu fr')
    .row()
    .text('🇮🇹 Италия', 'workMenu it')
    .text('🇪🇸 Испания', 'workMenu es')
    .row()
    .text('🇬🇧🇺🇸🇨🇦🇦🇺', 'workMenu us')
    .row()
    .text('Назад', 'menu');
async function handler(ctx) {
    return ctx.editMessageCaption({
        caption: `
Да-да, тебе не нужно делать это лапками!
Просто кидай ссылку с площадки, которую заводишь и бот автоматически создат тебе ссылку для мохнатого 🦣
`.replace("\n", ``),
        reply_markup: keyboard
    });
}
exports.handler = handler;
async function callbackAnswer(ctx) {
    return ctx.answerCallbackQuery({
        show_alert: true,
        text: '⚠️ Ручное создание сейчас недоступно\nОтправь ссылку объявления в бота'
    });
}
