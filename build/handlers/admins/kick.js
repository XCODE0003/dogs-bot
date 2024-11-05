"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const getUsername_1 = require("../../helpers/getUsername");
const database_1 = require("../../database");
const user_1 = require("../../database/models/user");
const regex = /admin kick (?<userId>\d+) (?<type>true|choice)/gmsi;
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
    if (!user) {
        return ctx.reply(`User undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    if (type === 'choice') {
        return ctx.reply(`Вы уверены что хотите кикнуть ${await (0, getUsername_1.getUsername)(user, true, true)} ?`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Да', callback_data: `admin kick ${tgId} true` }],
                    [{ text: 'Закрыть', callback_data: `deleteThisMessage` }],
                ]
            }
        });
    }
    if (type === 'true') {
        user.role = user_1.UserRole.RANDOM;
        await database_1.userRepository.save(user);
        return ctx.editMessageText(`${await (0, getUsername_1.getUsername)(user)} был кикнут.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: `deleteThisMessage` }],
                ]
            }
        });
    }
}
