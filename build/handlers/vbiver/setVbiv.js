"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const getUsername_1 = require("../../helpers/getUsername");
const database_1 = require("../../database");
const command_1 = require("../../handlers/menu/command");
const config_1 = require("../../utils/config");
const stickerList_1 = require("../../utils/stickerList");
exports.composer = new grammy_1.Composer();
const regex = /user set vbiv (?<boolean>true|false)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const boolean = match.groups.boolean;
    ctx.user.naVbive = boolean === 'true';
    await database_1.userRepository.save(ctx.user);
    await ctx.deleteMessage();
    await (0, command_1.handlerMenu)(ctx);
    if (ctx.user.naVbive) {
        try {
            await ctx.api.sendSticker(config_1.config.chats.chat, stickerList_1.stickerList['vbiv']);
        }
        catch (e) { }
    }
    const text = `<b>${await (0, getUsername_1.getUsername)(ctx.user, true)}</b> ${(ctx.user.naVbive) ? 'на вбиве!' : 'ушел со вбива'}`;
    await ctx.api.sendMessage(config_1.config.chats.chat, text, {
        parse_mode: 'HTML'
    });
    return ctx.reply(text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
            ]
        }
    });
}
