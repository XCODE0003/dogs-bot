"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const menu_1 = require("../../../handlers/admins/mentors/menu");
const getUsername_1 = require("../../../helpers/getUsername");
const regex = /admin mentors list (?<status>on|off)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const status = (match.groups.status === "on");
    const mentors = await database_1.mentorsRepository.find({
        relations: { user: true },
        where: {
            active: status
        }
    });
    if (mentors.length === 0) {
        return ctx.reply(`${(status) ? 'Активных' : "Не активных"} наставников сейчас нет`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    for (const mentor of mentors) {
        let text = `🐨 Наставник: ${await (0, getUsername_1.getUsername)(mentor.user)} || ${mentor.percent}%`;
        text += `\n🌳 Активный: ${(mentor.active) ? 'Да' : 'Нет'}`;
        text += `\n\n<code>/admin mentor ${mentor.user.tgId}</code>`;
        await ctx.reply(text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Подробнее', callback_data: `/admin mentor ${mentor.user.tgId}` }]
                ]
            }
        });
        await new Promise(res => setTimeout(res, 1000 * 0.35));
    }
    return (0, menu_1.mentorsMenu)(ctx);
}
