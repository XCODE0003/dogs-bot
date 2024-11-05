"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
const regex = /students remove (?<tgId>\d+)/gmi;
exports.composer.callbackQuery(regex, callbackHandler);
async function callbackHandler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const tgId = Number(match.groups.tgId);
    const user = await database_1.userRepository.findOne({
        where: {
            tgId
        }
    });
    if (!user || user.mentor.user !== ctx.user) {
        return ctx.reply(`User undefined OR Your not user mentor`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Dabro', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    user.mentor = null;
    await database_1.userRepository.save(user);
    try {
        await ctx.deleteMessage();
    }
    catch (e) { }
    return ctx.reply(`Вы удалили пользователя с учеников`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'ОК', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
