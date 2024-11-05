"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../../database");
exports.composer = new grammy_1.Composer();
const regex = /mentor status (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, command);
async function command(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = Number(match.groups.id);
    const mentor = await database_1.mentorsRepository.findOne({
        where: {
            id
        }
    });
    if (!mentor) {
        return ctx.reply('Mentor undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    mentor.active = !mentor.active;
    await database_1.mentorsRepository.save(mentor);
    const studentList = await database_1.userRepository.find({
        relations: { mentor: true },
        where: {
            mentor
        }
    });
    for (const stud of studentList) {
        stud.mentor = null;
        await database_1.userRepository.save(stud);
    }
    return ctx.reply(`Наставник был ${(mentor.active) ? 'Включен' : 'Выключен'}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
