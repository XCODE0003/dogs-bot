"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportInfo = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getUsername_1 = require("../../../helpers/getUsername");
const regex = /\/admin\s+support\s+(?<tgid>\d+)/gmi;
exports.composer = new grammy_1.Composer();
exports.composer.hears(regex, supportInfo);
exports.composer.callbackQuery(regex, supportInfo);
async function supportInfo(ctx) {
    let match;
    if (ctx?.callbackQuery?.data) {
        await ctx.answerCallbackQuery();
        match = regex.exec(ctx.callbackQuery.data);
    }
    else {
        match = regex.exec(ctx.match[0]);
    }
    const id = match.groups.tgid;
    const support = await database_1.supportsRepository.findOne({
        relations: { user: true },
        where: {
            user: {
                tgId: Number(id)
            }
        }
    });
    if (!support) {
        return ctx.reply(`ТПшера не существует`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🍀 Создать', callback_data: `admin support create ${id}` }],
                    [{ text: 'Закрыть', callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    const user = await database_1.userRepository.findOne({
        where: {
            tgId: Number(id)
        }
    });
    if (!user) {
        return ctx.reply(`Пользователя нет в базе данных, но есть в таблице ТПшеров))) кодеру в лс напишите пж)`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    return ctx.reply(`
🐨 ТПшер: ${await (0, getUsername_1.getUsername)(support.user, true)} || ${support.percent}%

🌳 Процент: ${support.percent}%
🌳 Активный: ${(support.active) ? 'Да' : 'Нет'}
🌳 Smartsupp код: <code>${support.code}</code>

🌳 Описание: ${support.description}
    `, {
        reply_markup: {
            inline_keyboard: [
                [{ text: `${(support.active) ? "🪫 Отключить" : "🔋 Включить"}`, callback_data: `support change status ${support.id}` }],
                [{ text: "🪵 Изменить процент", callback_data: `support change percent ${support.id}` }],
                [{ text: "🌿 Изменить описание", callback_data: `support change description ${support.id}` }],
                [{ text: "🌳 Изменить код", callback_data: `support change code ${support.id}` }],
                [{ text: "Закрыть", callback_data: `deleteThisMessage` }],
            ]
        }
    });
}
exports.supportInfo = supportInfo;
