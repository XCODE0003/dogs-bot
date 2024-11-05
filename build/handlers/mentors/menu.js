"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorsCallbackMenu = exports.mentorsMenu = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const getPictureMenu_1 = require("../../helpers/getPictureMenu");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('mentors menu', mentorsCallbackMenu);
exports.composer.callbackQuery('mentors menuWithPhoto', mentorsMenu);
async function mentorsMenu(ctx) {
    const mentor = await isMentor(ctx.user);
    if (mentor === undefined) {
        return ctx.reply(`Вы не наставник`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    const data = await getData(mentor.id);
    let text = '';
    text += `\n\nВсего в учениках: ${data.childrenCount}`;
    text += `\nЗаработано с учеников: ${data.profitCount} USD`;
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: "Список учеников", callback_data: `mentors students list` }],
                [{ text: "Назад", callback_data: `settings` }],
            ]
        }
    });
}
exports.mentorsMenu = mentorsMenu;
async function mentorsCallbackMenu(ctx) {
    const mentor = await isMentor(ctx.user);
    if (mentor === undefined) {
        return ctx.reply(`Вы не наставник`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    const data = await getData(mentor.id);
    let text = '';
    text += `\n\nВсего в учениках: ${data.childrenCount}`;
    text += `\nЗаработано с учеников: ${data.profitCount} USD`;
    return ctx.editMessageCaption({
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: "Список учеников", callback_data: `mentors students list` }],
                [{ text: "Назад", callback_data: `settings` }],
            ]
        }
    });
}
exports.mentorsCallbackMenu = mentorsCallbackMenu;
async function getData(mentorId) {
    const users = await database_1.userRepository.find({
        relations: {
            mentor: true
        },
        where: {
            mentor: {
                id: mentorId
            }
        }
    });
    let childrenCount = 0;
    for (const user of users) {
        childrenCount++;
    }
    const profits = await database_1.profitRepository.find({
        relations: {
            mentor: true
        },
        where: {
            mentor: {
                id: mentorId
            }
        }
    });
    let profitCount = 0;
    for (const profit of profits) {
        profitCount += Number(profit.mentorValue);
    }
    return {
        profitCount,
        childrenCount
    };
}
async function isMentor(user) {
    return await database_1.mentorsRepository.findOne({
        relations: { user: true },
        where: {
            user: {
                tgId: user.tgId
            }
        }
    });
}
