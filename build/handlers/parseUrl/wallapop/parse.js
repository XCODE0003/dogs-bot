"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_1 = require("grammy");
const ads_1 = require("../../../database/models/ads");
const database_1 = require("../../../database");
const moment_1 = __importDefault(require("moment"));
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
const grammy_scenes_1 = require("grammy-scenes");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const parseStringWallapop_1 = require("../../../handlers/parseUrl/wallapop/parseStringWallapop");
const getFlagEmoji_1 = require("../../../helpers/getFlagEmoji");
const getDomen_1 = require("../../../helpers/getDomen");
const console_1 = __importDefault(require("console"));
exports.composer = new grammy_1.Composer();
const regex = /(?<platform>\w+)\.wallapop\.com\/(?<link>.+)/gm;
const regex2 = /(?<platform>\w+)\.wallapop\.com\/(?<link>.+)\?/gm;
exports.composer.hears(regex, handler);
moment_1.default.locale('ru');
async function preCreateAd(ctx, parse, match) {
    const { ads, newAd } = await createAd(parse, ctx, match);
    const domen = await (0, getDomen_1.getDomen)(ctx.user, 'wallapop');
    if (!domen)
        return ctx.reply('domen undefined error');
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: `
${(newAd) ? '🪄 Ссылка создана!' : '🪄 Ссылка была создана ранее!'}

🐨 ID объявления: <code>${ads.date}</code>

🌳 <b>Название:</b> <code>${ads.title}</code>
🌳 <b>Цена:</b> <code>${ads.price}</code>
🌳 <b>Платформа: WALLAPOP [${match[1].toUpperCase()} ${(0, getFlagEmoji_1.getFlagEmoji)(match[1])}]</b>
♻️ <b>Домен сменён ${(0, moment_1.default)(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖

💠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ads.link}">LINK [2.0]</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ads.id, ctx.user)
    });
}
const createKeyboard = async (id, user) => {
    const keyb = new grammy_1.InlineKeyboard();
    // .text("🙊 Настройки", `settings ad ${id}`)
    keyb.row();
    if (user.sms > 0) {
        keyb.text("📲 SMS", `sms ad ${id}`);
    }
    if (user.email > 0) {
        keyb.text("💌 EMAIL", `email ad ${id}`);
    }
    keyb.row();
    keyb.text("⚙ Настройки", `settings ad ${id}`);
    keyb.row();
    keyb.text("Главное меню", `menuWithPicture`);
    return keyb;
};
async function handler(ctx) {
    const parse = await (0, parseStringWallapop_1.parseStringWallapop)(ctx.msg.text, ctx);
    if (parse === undefined)
        return null;
    let match = regex2.exec(ctx.msg.text);
    if (!match) {
        match = regex.exec(ctx.msg.text);
    }
    return ctx.scenes.enter('setDeliveryAmountWallapop', {
        parse, match
    });
}
async function cancel(ctx) {
    try {
        await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    }
    catch (e) { }
    ctx.scene.exit();
}
exports.scene = new grammy_scenes_1.Scene('setDeliveryAmountWallapop');
exports.scene.always().callbackQuery(/skip setDeliveryAmountWallapop/, async (ctx) => {
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match);
    return cancel(ctx);
});
exports.scene.always().callbackQuery(/wallapop setDeliveryInAd/, async (ctx) => {
    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = Number(parseFloat(ctx.session.anyObject.parse.detail.totalPrice)).toFixed(2);
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match);
    return cancel(ctx);
});
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    ctx.session.anyObject = ctx.scene.arg;
    let keyb = [];
    // @ts-ignore
    if (ctx.session.anyObject?.parse?.detail?.totalPrice !== undefined) {
        keyb.push([{ text: '🔋 Использовать цену с обьявления', callback_data: 'wallapop setDeliveryInAd' }]);
    }
    keyb.push([{ text: 'Пропустить', callback_data: 'skip setDeliveryAmountWallapop' }]);
    // @ts-ignore
    const res = await ctx.reply(`<b>💰 Цена доставки в обьявлении: <code>${Number(parseFloat(ctx.session.anyObject?.parse?.detail?.totalPrice) - parseFloat(ctx.session.anyObject?.parse?.detail?.price)).toFixed(2)} €</code></b>\n\n<b>🚚 Напиши цену доставки: </b>`, {
        reply_markup: {
            inline_keyboard: keyb
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    return ctx.scene.resume();
});
exports.scene.wait().hears(/(^\d+\.\d\d)|(^\d+)/, async (ctx) => {
    try {
        ctx.deleteMessage();
    }
    catch (e) { }
    const userPrice = parseFloat(ctx.match[0]);
    // @ts-ignore
    const price = ctx.session.anyObject.parse.detail.price = ctx.session.anyObject.parse.detail.price.replace(/\./, '');
    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = (userPrice + parseFloat(price)).toFixed(2);
    console_1.default.log(ctx.match[0], userPrice, price, parseFloat(price));
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match);
    return cancel(ctx);
});
const createAd = async (parse, ctx, match) => {
    const oldAd = await database_1.adsRepository.findOne({
        relations: { author: true },
        where: {
            originallink: match[2],
            country: 'es',
            service: 'vinted',
            author: {
                tgId: ctx.user.tgId
            }
        }
    });
    if (oldAd && oldAd.delete !== false)
        return {
            ads: oldAd,
            newAd: false
        };
    const date = Date.now();
    const ads = new ads_1.Ads();
    ads.title = parse.detail.title;
    ads.description = parse.detail.description;
    ads.price = parse.detail.price + " €";
    ads.img = parse.detail.img;
    ads.link = `${match[2]}${date}`;
    ads.originallink = `${match[2]}`;
    ads.date = `${date}`;
    ads.country = match[1];
    ads.service = 'wallapop';
    ads.author = ctx.user;
    ads.page = parse.page;
    ads.pageMobile = parse.pageMobile;
    ads.created = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    await database_1.adsRepository.save(ads);
    return {
        ads,
        newAd: true
    };
};
