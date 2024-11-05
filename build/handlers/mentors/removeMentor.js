"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
const regex = /mentors remove/;
exports.composer.callbackQuery(regex, callbackHandler);
async function callbackHandler(ctx) {
    const profits = await database_1.profitRepository.find({
        where: {
            worker: ctx.user,
            mentor: ctx.user.mentor
        }
    });
    return ctx.reply(`Наставник уберется автоматически после ${ctx.user.mentor.freedom} профитов.\nУ вас ${profits.length}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
            ]
        }
    });
}
