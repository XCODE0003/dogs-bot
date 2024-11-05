"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../../database");
exports.composer = new grammy_1.Composer();
const regex = /^support change status (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, command);
async function command(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = Number(match.groups.id);
    const support = await database_1.supportsRepository.findOne({
        where: {
            id
        }
    });
    if (!support) {
        return ctx.reply('Support undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    support.active = !support.active;
    await database_1.supportsRepository.save(support);
    const studentList = await database_1.userRepository.find({
        relations: { supportUser: true },
        where: {
            supportUser: support
        }
    });
    for (const stud of studentList) {
        stud.supportUser = null;
        await database_1.userRepository.save(stud);
    }
    return ctx.reply(`ТПшер был ${(support.active) ? 'Включен' : 'Выключен'}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
