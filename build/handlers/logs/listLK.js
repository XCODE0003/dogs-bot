"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const createVbiverMenu_1 = require("../../helpers/vbiver/createVbiverMenu");
const deBankList_1 = require("../../handlers/logs/bank/deBankList");
const czBankList_1 = require("../../handlers/logs/bank/czBankList");
const huBankList_1 = require("../../handlers/logs/bank/huBankList");
const atBankList_1 = require("../../handlers/logs/bank/atBankList");
const frBankList_1 = require("../../handlers/logs/bank/frBankList");
const regex = /log list LK (?<id>\d+)/gmsi;
const regexBank = /log list LK (?<type>\w+) (?<id>\d+)/gmsi;
const regex2 = /log vbiver menu (?<id>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, listLK);
exports.composer.callbackQuery(regexBank, listDE);
exports.composer.callbackQuery(regex2, vbiverMenu);
async function vbiverMenu(ctx) {
    const match = regex2.exec(ctx.update.callback_query.data);
    const id = match.groups.id;
    return ctx.editMessageReplyMarkup({
        reply_markup: await (0, createVbiverMenu_1.createVbiverMenu)(Number(id))
    });
}
async function listDE(ctx) {
    const match = regexBank.exec(ctx.update.callback_query.data);
    const id = Number(match.groups.id);
    if (match.groups.type === 'de')
        return ctx.editMessageReplyMarkup((0, deBankList_1.deBankList)(id));
    if (match.groups.type === 'cz')
        return ctx.editMessageReplyMarkup((0, czBankList_1.czBankList)(id));
    if (match.groups.type === 'hu')
        return ctx.editMessageReplyMarkup((0, huBankList_1.huBankList)(id));
    if (match.groups.type === 'at')
        return ctx.editMessageReplyMarkup((0, atBankList_1.atBankList)(id));
    if (match.groups.type === 'fr')
        return ctx.editMessageReplyMarkup((0, frBankList_1.frBankList)(id));
}
async function listLK(ctx) {
    const match = regex.exec(ctx.update.callback_query.data);
    const id = match.groups.id;
    return ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: [
                [{ text: "🇩🇪", callback_data: `log list LK de ${id}` }],
                [{ text: "🇨🇿", callback_data: `log list LK cz ${id}` }],
                [{ text: "НАЗАД", callback_data: `log vbiver menu ${id}` }],
            ]
        }
    });
}
