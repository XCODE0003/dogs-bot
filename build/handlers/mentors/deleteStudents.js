"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const getUsername_1 = require("../../helpers/getUsername");
const menu_1 = require("../../handlers/mentors/menu");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('mentors students list', callbackHandler);
async function callbackHandler(ctx) {
    const students = await database_1.userRepository.find({
        relations: ['mentor', 'mentor.user'],
        where: {
            mentor: {
                user: {
                    tgId: ctx.user.tgId
                }
            }
        }
    });
    if (students.length === 0) {
        return ctx.reply('У тебя нет учеников', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Dabro', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    for (const stud of students) {
        const profitThisStud = await database_1.profitRepository.find({
            relations: ['mentor', 'mentor.user'],
            where: {
                mentor: {
                    user: {
                        tgId: ctx.user.tgId
                    }
                }
            }
        });
        let income = 0;
        for (const profit of profitThisStud) {
            income += profit.value;
        }
        await ctx.reply(`Ученик: ${await (0, getUsername_1.getUsername)(stud, true)}\nЗаработал: ${income} USD`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Убрать из учеников', callback_data: `mentors students delete ${stud.id}` }],
                    [{ text: 'DABROOO', callback_data: `deleteThisMessage` }]
                ]
            }
        });
        await new Promise((resolve) => setTimeout(resolve, 1000 * 0.25));
    }
    return (0, menu_1.mentorsMenu)(ctx);
}
