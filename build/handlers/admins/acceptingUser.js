"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const user_1 = require("../../database/models/user");
const moment_1 = __importDefault(require("moment/moment"));
const regex = /admin (?<type>accept|decline) (?<userId>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const type = match.groups.type;
    const tgId = Number(match.groups.userId);
    const user = await database_1.userRepository.findOne({
        where: {
            tgId
        }
    });
    if (!user)
        return ctx.reply("user undefined");
    if (type === 'accept') {
        user.role = user_1.UserRole.WORKER;
        user.created = (0, moment_1.default)().toJSON();
        await database_1.userRepository.save(user);
        await ctx.api.sendPhoto(user.tgId, new grammy_1.InputFile('assets/photos/logo.jpg'), {
            caption: `<b>🌿 Заявка одобрена!</b>`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Меню', callback_data: 'menuNewMessage' }],
                ]
            }
        });
    }
    if (type === 'decline') {
        user.role = user_1.UserRole.RANDOM;
        await database_1.userRepository.save(user);
        await ctx.api.sendMessage(user.tgId, `<b>🦧 К сожалению, мы пока не готовы принять тебя в команду.</b>`);
    }
    return ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: [
                [{ text: `${(type === 'accept') ? 'Принят' : 'Не принят'}`, callback_data: 'oaoaooa' }]
            ]
        }
    });
}
