"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const getUsername_1 = require("../../helpers/getUsername");
const usernames_1 = require("../../utils/usernames");
const regex = /\/id (?<name>\w+|@\w+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.hears(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.match[0]);
    let name = match.groups.name;
    if (name[0] === '@')
        name = name.slice(1, name.length);
    const dataObject = await usernames_1.UsernameListForAdmin.getUsernameById(name);
    if (!dataObject) {
        return ctx.reply(`Username undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
                ]
            }
        });
    }
    const user = await database_1.userRepository.findOne({
        where: {
            tgId: dataObject.telegramId
        }
    });
    await ctx.deleteMessage();
    if (!user)
        return ctx.reply("User undefined", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
                ]
            }
        });
    let text = `
🌳 ${await (0, getUsername_1.getUsername)(user, true)} [<code>${user.tgId}</code> | @${name}]`;
    return ctx.reply(text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🐨 Меню пользователя", callback_data: `admin user ${user.tgId}` }],
                [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
            ]
        }
    });
}
