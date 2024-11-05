"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsInfo = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getUsername_1 = require("../../../helpers/getUsername");
const user_1 = require("../../../database/models/user");
const moment_1 = __importDefault(require("moment"));
const regex = /\/admin\s+vbiver\s+(?<tgid>\d+)/gmi;
exports.composer = new grammy_1.Composer();
exports.composer.hears(regex, smsInfo);
exports.composer.callbackQuery(regex, smsInfo);
async function smsInfo(ctx) {
    let match;
    if (ctx?.callbackQuery?.data) {
        await ctx.answerCallbackQuery();
        match = regex.exec(ctx.callbackQuery.data);
    }
    else {
        match = regex.exec(ctx.match[0]);
    }
    const id = Number(match.groups.tgid);
    const user = await database_1.userRepository.findOne({
        where: {
            tgId: Number(id)
        }
    });
    if (user.role !== user_1.UserRole.VBIVER) {
        return ctx.reply(`Пользователь ${await (0, getUsername_1.getUsername)(user)} не вбивер`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🐨 Сделать вбивером', callback_data: `admin set role vbiver ${user.id}` }],
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }],
                ]
            }
        });
    }
    if (!user) {
        return ctx.reply(`Пользователя нет в базе данных, но есть в таблице вбиверов))) кодеру в лс напишите пж)`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    return ctx.reply(`
🐨 Пользователь: ${await (0, getUsername_1.getUsername)(user, true)}

⌚️ На вбиве с: <code>${(0, moment_1.default)(new Date(user.vbivDate)).format('DD.MM.YYYY в hh:mm')}</code>
    `, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🐨 Сделать воркером", callback_data: `admin set role worker ${user.id}` }],
                [{ text: "Закрыть", callback_data: `deleteThisMessage` }],
            ]
        }
    });
}
exports.smsInfo = smsInfo;
