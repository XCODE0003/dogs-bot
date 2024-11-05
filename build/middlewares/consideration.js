"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.considerationMiddleware = void 0;
const user_1 = require("../database/models/user");
const setupSession_1 = require("../utils/setupSession");
async function considerationMiddleware(ctx, next) {
    if (ctx.from.id !== ctx.chat.id)
        return next();
    if (await setupSession_1.redis.get(`cons-${ctx.from.id}`) === '1' && /start|vbiv|top|me/gmi.exec(ctx.msg.text)) {
        return ctx.reply(`Нельзя вводить команды`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    if (await setupSession_1.redis.get(`cons-${ctx.from.id}`) !== '1' && ctx.user.role === user_1.UserRole.RANDOM && !ctx.callbackQuery) {
        return ctx.reply(`
Подай заявку
<b>Не подается заявка? Напиши мне:</b> <a href="https://t.me/mightysequoia">mightysequoia</a>
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Подать заявку", callback_data: `apply` }]
                ]
            }
        });
    }
    return next();
}
exports.considerationMiddleware = considerationMiddleware;
