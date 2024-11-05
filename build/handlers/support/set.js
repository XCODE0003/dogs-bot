"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
const regex = /^support set (?<type>\w+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const type = match.groups.type;
    if (type === 'our') {
        ctx.user.supportTeam = true;
        await database_1.userRepository.save(ctx.user);
        return ctx.reply('Установленa наша тех. поддержка', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    else {
        ctx.user.supportTeam = false;
        await database_1.userRepository.save(ctx.user);
        return ctx.scenes.enter('support-update-code');
    }
}
