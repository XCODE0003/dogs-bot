"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const getFlagEmoji_1 = require("../../helpers/getFlagEmoji");
exports.composer = new grammy_1.Composer();
const regex = /profiles info (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = Number(match.groups.id);
    const profile = await database_1.profilesRepository.findOne({
        where: {
            id
        }
    });
    if (!profile) {
        return ctx.reply(`Профиль не найден`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    let text = `<b>${(0, getFlagEmoji_1.getFlagEmoji)(profile.country)} ${profile.service.toUpperCase()}</b>`;
    text += `\n\n<b>👤 ФИО:</b> <code>${profile.fullName}</code>`;
    text += `\n<b>🏘 Доставка:</b> <code>${profile.delivery}</code>`;
    text += `\n<b>📲 Номер:</b> <code>${profile.phone}</code>`;
    return ctx.reply(text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👤 Сменить ФИО', callback_data: `profile set fullname ${profile.id}` }],
                [{ text: '📲 Сменить номер телефона', callback_data: `profile set phone ${profile.id}` }],
                [{ text: '🏘 Сменить адрес', callback_data: `profile set delivery ${profile.id}` }],
                [{ text: '🐾 Удалить', callback_data: `profile delete ${profile.id} question` }],
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
