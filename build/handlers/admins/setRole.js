"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const user_1 = require("../../database/models/user");
const getUsername_1 = require("../../helpers/getUsername");
const isSuperAdmin_1 = require("../../helpers/isSuperAdmin");
const moment_1 = __importDefault(require("moment"));
const regex = /admin set role (?<role>\w+) (?<id>\d+)/gmsi;
const regexAdmin = /admin set admin (?<boolean>\w+) (?<id>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
exports.composer.callbackQuery(regexAdmin, handlerAdmin);
async function handler(ctx) {
    const match = regex.exec(ctx.update.callback_query.data);
    const id = Number(match.groups.id);
    const role = match.groups.role;
    const user = await database_1.userRepository.findOne({
        where: {
            id: id
        }
    });
    console.log(user);
    if (!user) {
        return ctx.reply(`User undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    if (role === 'vbiver') {
        user.role = user_1.UserRole.VBIVER;
        user.vbivDate = (0, moment_1.default)().toJSON();
    }
    if (role === 'worker') {
        user.role = user_1.UserRole.WORKER;
    }
    await database_1.userRepository.save(user);
    return ctx.reply(`User change role to ${user.role}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
async function handlerAdmin(ctx) {
    if (!(0, isSuperAdmin_1.isSuperAdmin)(ctx))
        return null;
    const match = regexAdmin.exec(ctx.callbackQuery.data);
    const boolean = match.groups.boolean;
    const id = Number(match.groups.id);
    const user = await database_1.userRepository.findOne({
        where: {
            id
        }
    });
    if (!user)
        return ctx.reply("User undefined", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
                ]
            }
        });
    user.admin = boolean === 'true';
    await database_1.userRepository.save(user);
    return ctx.reply(`<b>${await (0, getUsername_1.getUsername)(user, true)}</b> ${(user.admin) ? 'теперь администратор' : 'снят с админки'}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
            ]
        }
    });
}
