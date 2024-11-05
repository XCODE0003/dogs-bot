"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const getUsername_1 = require("../../helpers/getUsername");
exports.composer = new grammy_1.Composer();
const regex = /mentors (?<choice>\w+) (?<userId>\d+) (?<mentorid>\d+)/;
exports.composer.callbackQuery(regex, callbackHandler);
async function callbackHandler(ctx) {
    const match = regex.exec(ctx.match[0]);
    const userId = match.groups.userId;
    const mentorId = match.groups.mentorid;
    const choice = match.groups.choice;
    if (choice === 'accept') {
        await ctx.deleteMessage();
        const user = await database_1.userRepository.findOne({
            where: {
                id: Number(userId)
            }
        });
        if (user.mentor) {
            return ctx.reply(`❗ У пользователя ${await (0, getUsername_1.getUsername)(user, true, true)} уже есть наставник`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                    ]
                }
            });
        }
        const mentor = await database_1.mentorsRepository.findOne({
            where: { id: Number(mentorId) }
        });
        if (!mentor) {
            return ctx.reply(`Ментор не найден`);
        }
        user.mentor = mentor;
        await database_1.userRepository.save(user);
        await ctx.reply(`🧸 Ты принял в состав ${await (0, getUsername_1.getUsername)(user, true, true)}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        });
        return ctx.api.sendMessage(user.tgId, `🧸 Тебя принял в ученики ${await (0, getUsername_1.getUsername)(ctx.user, true, true)}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    if (choice === 'cancel') {
        const user = await database_1.userRepository.findOne({
            where: {
                id: Number(userId)
            }
        });
        await ctx.deleteMessage();
        await ctx.reply(`🧸 Ты отклонил запрос ${await (0, getUsername_1.getUsername)(user)}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        });
        return ctx.api.sendMessage(user.tgId, `🧸 Наставник ${await (0, getUsername_1.getUsername)(ctx.user, true, true)} отклонил твой запрос`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
}
