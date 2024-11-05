"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsInfo = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getUsername_1 = require("../../../helpers/getUsername");
const regex = /\/admin\s+mailing\s+(?<tgid>\d+)/gmi;
exports.composer = new grammy_1.Composer();
exports.composer.hears(regex, smsInfo);
exports.composer.callbackQuery(regex, smsInfo);
async function smsInfo(ctx) {
    let match;
    if (ctx?.callbackQuery?.data) {
        ctx.answerCallbackQuery();
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
    if (!user) {
        return ctx.reply(`Пользователя нет в базе данных, но есть в таблице наставников))) кодеру в лс напишите пж)`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    return ctx.reply(`
🐨 Воркер: ${await (0, getUsername_1.getUsername)(user, true)}

📲 SMS: ${user.sms}
💌 EMAIL: ${user.email}
    `, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "➕ Добавить SMS", callback_data: `sms issue ${user.tgId}` }],
                [{ text: "➕ Добавить EMAIL", callback_data: `email issue ${user.tgId}` }],
                [{ text: "Закрыть", callback_data: `deleteThisMessage` }],
            ]
        }
    });
}
exports.smsInfo = smsInfo;
