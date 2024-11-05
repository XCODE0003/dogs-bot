"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMiddleware = void 0;
const grammy_1 = require("grammy");
const stickerList_1 = require("../utils/stickerList");
const database_1 = require("../database");
async function chatMiddleware(ctx, next) {
    if (ctx.user.lastProfit && ctx.chat.id !== ctx.from.id) {
        let currentDate = Date.now();
        let days = (currentDate - Date.parse(ctx.user.lastProfit.created_at.toString())) / 86400000; //86400000 - ms в дне
        days = Math.round(days);
        if (days > 3 && ctx.user.lastProfit.zagnobil === false) {
            try {
                await ctx.replyWithSticker(stickerList_1.stickerList.YouFuckingLazy, {
                    reply_to_message_id: ctx.message.message_id
                });
            }
            catch (e) { }
            ctx.user.lastProfit.zagnobil = true;
            await database_1.profitRepository.save(ctx.user.lastProfit);
        }
    }
    if (ctx.chat.id !== ctx.from.id) {
        if (ctx.message?.text === 'заводим') {
            try {
                ctx.replyWithDocument(new grammy_1.InputFile('assets/gif/zavodim.MP4'));
            }
            catch (e) { }
        }
        else if (ctx.message?.text === 'стоп') {
            try {
                ctx.replyWithDocument(new grammy_1.InputFile('assets/gif/ne_zavodim.MP4'));
            }
            catch (e) { }
        }
        else if (ctx.message?.text.toLowerCase() === 'sadkawaii') {
            try {
                ctx.replyWithPhoto(new grammy_1.InputFile('assets/photos/sadkawaii.jpg'));
            }
            catch (e) { }
        }
    }
    return next();
}
exports.chatMiddleware = chatMiddleware;
