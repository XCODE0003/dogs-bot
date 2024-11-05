"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateMiddleware = void 0;
const user_1 = require("../database/models/user");
const config_1 = require("../utils/config");
const database_1 = require("../database");
async function privateMiddleware(ctx, next) {
    if (!ctx.callbackQuery) {
        if (ctx.chat.id !== ctx.from.id)
            return;
    }
    if (ctx?.message?.text === '/kickNeActiveUsers') {
        const users = await database_1.userRepository.find();
        for (const user of users) {
            if (user.role === user_1.UserRole.RANDOM
                || user.role === user_1.UserRole.CONSIDERATION
                || user.role === user_1.UserRole.BAN
                || user.role === user_1.UserRole.NOTACCEPT) {
                try {
                    const res = await ctx.api.kickChatMember(config_1.config.chats.chat, user.tgId);
                    console.log(res);
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
    }
    if (!ctx.from.username)
        return ctx.reply('Установи username!');
    if (ctx.user.role === user_1.UserRole.CONSIDERATION && ctx?.callbackQuery?.data !== 'deleteThisMessage') {
        return ctx.reply(`⏳ Заявка на рассмотрении, пожалуйста ожидай.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    if (ctx.user.role === user_1.UserRole.NOTACCEPT) {
        return ctx.reply(`<b>🦧 К сожалению мы пока не готовы принять тебя в команду.</b>`);
    }
    if (ctx.user.role === user_1.UserRole.BAN) {
        return ctx.reply(`😐`);
    }
    return next();
}
exports.privateMiddleware = privateMiddleware;
