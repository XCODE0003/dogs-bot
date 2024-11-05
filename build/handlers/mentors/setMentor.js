"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const getUsername_1 = require("../../helpers/getUsername");
const setupSession_1 = require("../../utils/setupSession");
exports.composer = new grammy_1.Composer();
const regex = /mentors set for user (?<id>\d+)/;
exports.composer.callbackQuery(regex, callbackHandler);
async function callbackHandler(ctx) {
    const match = regex.exec(ctx.match[0]);
    const mentorId = match.groups.id;
    let timeout = await setupSession_1.redis.get(`${ctx.from.id}-mentor-timeout`);
    if (timeout) {
        let minutes = (Date.now() - Number(timeout)) / 60000; //86400000 - ms в дне
        minutes = Math.round(minutes);
        if (minutes < 59) {
            return ctx.reply(`♻️ Ты уже подал заявку одному из менторов, подожди 1 час`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                    ]
                }
            });
        }
    }
    if (ctx.user.mentor) {
        return ctx.reply(`❗️ У тебя уже есть наставник`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    const mentor = await database_1.mentorsRepository.findOne({
        where: { id: Number(mentorId) },
        relations: { user: true }
    });
    if (!mentor) {
        return ctx.reply(`❗️ Ментор не найден`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    setupSession_1.redis.set(`${ctx.from.id}-mentor-timeout`, Date.now());
    setupSession_1.redis.save();
    await ctx.api.sendMessage(mentor.user.tgId, `🧸 ${await (0, getUsername_1.getUsername)(ctx.user)} хочет к тебе в ученики!`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🪴 Принять", callback_data: `mentors accept ${ctx.user.id} ${mentor.id}` }],
                [{ text: "🐾 Отклонить", callback_data: `mentors cancel ${ctx.user.id} ${mentor.id}` }]
            ]
        }
    });
    return ctx.reply('✅ Заявка на ТП отправлена!\nОжидай решения.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
            ]
        }
    });
}
