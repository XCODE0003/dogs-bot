"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const getUsername_1 = require("../../helpers/getUsername");
const database_1 = require("../../database");
const console_1 = __importDefault(require("console"));
const regex = /admin set proStatus (?<userId>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const userId = Number(match.groups.userId);
    const user = await database_1.userRepository.findOne({
        where: {
            id: userId
        }
    });
    if (!user) {
        return ctx.reply(`User undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: `deleteThisMessage` }]
                ]
            }
        });
    }
    user.isPro = (!user.isPro);
    await database_1.userRepository.save(user);
    if (user.isPro) {
        try {
            await ctx.api.sendMessage(user.tgId, `
⬆️ Тебя повысили до статуса PRO ⬆️

🌿 Твой процент выплат поднимается на 10% - вместо 60%, ты получаешь 70% 📈
🌐 Отдельные домены которые доступны только "PRO воркерам".
💬 Отдельный чат для настоящих коал "PRO".
📨 Отдельные шлюзы отправки email.
🫣 Тег "PRO" в чатах, при желании можем тебе его не ставить.
💰 PRO-воркерам выдается бюджет на расходники или аккаунты/номера по запросу.
🛠 Добавим по вашему запросу конкретную площадку под ворк, так же можем ее скрыть для вас.
        `, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🐨 PRO ЧАТ", url: 'https://t.me/+45tu1EbZZ1QyN2My' }]
                    ]
                }
            });
        }
        catch (e) {
            console_1.default.log(e);
        }
    }
    return ctx.reply(`${await (0, getUsername_1.getUsername)(user)} теперь${(user.isPro) ? '' : ' не'} PRO`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: `deleteThisMessage` }],
            ]
        }
    });
}
