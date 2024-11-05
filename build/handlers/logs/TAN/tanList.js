"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const createVbiverMenu_1 = require("../../../helpers/vbiver/createVbiverMenu");
const regex = /log list tan (?<id>\d+)/gmsi;
const regex2 = /log vbiver menu (?<id>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, listTan);
exports.composer.callbackQuery(regex2, vbiverMenu);
async function vbiverMenu(ctx) {
    const match = regex2.exec(ctx.update.callback_query.data);
    const id = match.groups.id;
    return ctx.editMessageReplyMarkup({
        reply_markup: await (0, createVbiverMenu_1.createVbiverMenu)(Number(id))
    });
}
async function listTan(ctx) {
    const match = regex.exec(ctx.update.callback_query.data);
    const id = match.groups.id;
    return ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: [
                [{ text: "VR", callback_data: `log redirect tan vr ${id}` }],
                [{ text: "НАЗАД", callback_data: `log vbiver menu ${id}` }],
            ]
        }
    });
}
