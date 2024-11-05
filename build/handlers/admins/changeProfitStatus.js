"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const config_1 = require("../../utils/config");
const regex = /admin set paid (?<status>\w+) (?<id>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.update.callback_query.data);
    const id = match.groups.id;
    const status = match.groups.status;
    const profit = await database_1.profitRepository.findOne({
        where: { id: Number(id) }
    });
    if (!profit)
        return ctx.reply('Профит не найден');
    profit.isPaid = (status === 'true');
    await database_1.profitRepository.save(profit);
    if (status !== 'true') {
        await ctx.api.editMessageReplyMarkup(config_1.config.chats.payments, profit.msgId, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "⌚ Выплачивается ⌚", callback_data: `vyplata ${profit.id}` }]
                ]
            }
        });
        return ctx.editMessageReplyMarkup({
            reply_markup: {
                inline_keyboard: [
                    [{ text: "♻️ Не выплатил", callback_data: `admin set paid true ${profit.id}` }]
                ]
            }
        });
    }
    await ctx.api.editMessageReplyMarkup(config_1.config.chats.payments, profit.msgId, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "💗 ВЫПЛАЧЕНО", callback_data: `vyplata ${profit.id}` }]
            ]
        }
    });
    return ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: [
                [{ text: "👍🏼 Выплатил", callback_data: `admin set paid false ${profit.id}` }],
            ]
        }
    });
}
