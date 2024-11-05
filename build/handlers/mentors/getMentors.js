"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const getUsername_1 = require("../../helpers/getUsername");
exports.composer = new grammy_1.Composer();
exports.composer.command('mentors', callbackHandler);
exports.composer.callbackQuery('mentors', callbackHandler);
async function callbackHandler(ctx) {
    if (ctx.user.mentor) {
        return ctx.editMessageCaption({
            caption: `🧸 Твой наставник: ${await (0, getUsername_1.getUsername)(ctx.user.mentor.user)} || ${ctx.user.mentor.percent}%`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🐾 Убрать наставника", callback_data: `mentors remove` }],
                    [{ text: "Назад", callback_data: `settings` }]
                ]
            }
        });
    }
    const mentors = await database_1.mentorsRepository.find({
        relations: {
            user: true
        },
        where: {
            active: true
        }
    });
    if (mentors.length <= 0) {
        return ctx.reply(`Наставников сейчас нет`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    for (const mentor of mentors) {
        let keyb = [
            [{ text: "Подать заявку", callback_data: `mentors set for user ${mentor.id}` }]
        ];
        if (mentor === mentors[mentors.length - 1]) {
            keyb.push([{ text: "Меню", callback_data: `menuNewMessage` }]);
        }
        if (mentor.active) {
            await ctx.reply(`🧸 Наставник: ${await (0, getUsername_1.getUsername)(mentor.user)} || ${mentor.percent}% || ${mentor.freedom} профитов\n\n${mentor.description}`, {
                reply_markup: {
                    inline_keyboard: keyb
                }
            });
        }
    }
    await ctx.deleteMessage();
}
