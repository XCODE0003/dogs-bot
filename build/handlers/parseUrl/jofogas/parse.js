"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_1 = require("grammy");
const parseStringJofogas_1 = require("../../../handlers/parseUrl/jofogas/parseStringJofogas");
const ads_1 = require("../../../database/models/ads");
const database_1 = require("../../../database");
const moment_1 = __importDefault(require("moment"));
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
const grammy_scenes_1 = require("grammy-scenes");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const getServices_1 = require("../../../helpers/getServices");
const getFlagEmoji_1 = require("../../../helpers/getFlagEmoji");
const getDomen_1 = require("../../../helpers/getDomen");
exports.composer = new grammy_1.Composer();
const regex = /jofogas\.(?<platform>.+?)\/(?<link>.+)/gm;
const regex2 = /jofogas\.(?<platform>.+?)\/(?<link>.+)\?/gm;
exports.composer.hears(regex, handler);
moment_1.default.locale('ru');
async function preCreateAd(ctx, parse, match, profile) {
    const { ads, newAd } = await createAd(parse, ctx, match, profile);
    const domen = await (0, getDomen_1.getDomen)(ctx.user, 'jofogas');
    if (!domen)
        return ctx.reply('domen undefined error');
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: `
Фиш готов 👌

🆔 ID: <code>${ads.date}</code>

📦 <b>Товар:</b> <code>${ads.title}</code>
💸 <b>Цена:</b> <code>${ads.price}</code>
💡 <b>Платформа: JOFOGAS [${match[1].toUpperCase()} 🇭🇺]</b>
♻️ <b>Домен сменён ${(0, moment_1.default)(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>Созданная ссылка [JOFOGAS]:</b> <a href="https://${domen.link}/link/${ads.link}">LINK [2.0]</a>
🚚 <b>Созданная ссылка [FOXPOST]:</b> <a href="https://${domen.link}/service/foxpost/${ads.link}">LINK [2.0]</a>
🚚 <b>Созданная ссылка [GLS]:</b> <a href="https://${domen.link}/service/gls/${ads.link}">LINK [2.0]</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ads.id, ctx.user)
    });
}
const createKeyboard = async (id, user) => {
    const keyb = new grammy_1.InlineKeyboard();
    // .text("🙊 Настройки", `settings ad ${id}`)
    keyb.row();
    keyb.text("📲 SMS", `sms ad jofogas ${id}`);
    keyb.text("💌 EMAIL", `email ad jofogas ${id}`);
    keyb.row();
    keyb.text("⚙ Настройки", `settings ad ${id}`);
    keyb.row();
    keyb.text("Главное меню", `menuWithPicture`);
    return keyb;
};
async function handler(ctx) {
    const parse = await (0, parseStringJofogas_1.parseStringJofogas)(ctx.msg.text, ctx);
    if (parse === undefined)
        return null;
    let match = undefined;
    match = regex2.exec(ctx.msg.text);
    if (!match) {
        match = regex.exec(ctx.msg.text);
    }
    return ctx.scenes.enter('setDeliveryAmountJofogas', {
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
exports.scene = new grammy_scenes_1.Scene('setDeliveryAmountJofogas');
exports.scene.always().callbackQuery(/skip setDeliveryAmountJofogas/, async (ctx) => {
    // @ts-ignore
    ctx.scene.goto('choiceProfile');
});
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    ctx.session.anyObject = ctx.scene.arg;
    const res = await ctx.reply('🚚 <b>Введи цену доставки:</b>\n<code>Пример: 2250 | 25.49</code>', {
        reply_markup: {
            inline_keyboard: []
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    return ctx.scene.resume();
});
exports.scene.wait().hears(/(^\d+)|skip/, async (ctx) => {
    try {
        ctx.deleteMessage();
    }
    catch (e) { }
    const userPrice = parseInt(ctx.match[0]);
    ctx.session.tgId = userPrice;
    // @ts-ignore
    const price = parseInt(String(ctx.session.anyObject.parse.detail.price).replace(/ /g, ''));
    const newPrice = `${userPrice + price}`.split('').reverse().map((el, index) => index % 3 !== 2 ? el : ` ${el}`).reverse().join('') + ' ft';
    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = newPrice;
    console.log(ctx.match[0], userPrice, price, newPrice);
    ctx.scene.resume();
});
exports.scene.label('choiceProfile');
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const service = (0, getServices_1.getService)('jofogas');
    // @ts-ignore
    const country = ctx.session.anyObject?.match?.[1];
    const keyboard = new grammy_1.InlineKeyboard();
    const profiles = await database_1.profilesRepository.find({
        relations: { user: true },
        where: {
            service: service.name,
            country: country,
            user: {
                tgId: ctx.user.tgId
            }
        }
    });
    if (profiles.length === 0) {
        await ctx.reply(`
<b>${(0, getFlagEmoji_1.getFlagEmoji)(country)} ${service.name.toUpperCase()}</b>
Создай профиль для этой площадки и заново спарси ссылку`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    profiles.slice(0, 9);
    for (const i in profiles) {
        const profile = profiles[i];
        if (i === '3' || i === '6' || i === '9') {
            keyboard.row();
        }
        keyboard.text(`${(profile.fullName.length > 9) ? profile.fullName.slice(0, 9) + '...' : profile.fullName}`, `set profile ${profile.id}`);
    }
    const res = await ctx.reply(`Выбери профиль для <b>${(0, getFlagEmoji_1.getFlagEmoji)(country)} ${service.name.toUpperCase()}</b>`, {
        reply_markup: keyboard
    });
    ctx.session.deleteMessage.push(res.message_id);
});
exports.scene.wait().callbackQuery(/^set profile (\d+)$/gmi, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match, /^set profile (\d+)$/gmi.exec(ctx.callbackQuery.data)[1]);
    ctx.scene.exit();
});
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const createAd = async (parse, ctx, match, profile) => {
    const oldAd = await database_1.adsRepository.findOne({
        relations: { author: true },
        where: {
            originallink: match[2],
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
    const unix = String(Date.now());
    const randomInt1 = getRandomInt(0, 5);
    const randomInt2 = getRandomInt(666, 4657645344567);
    const date = `${unix.slice(13 - randomInt1, 13)}` + randomInt2;
    const ads = new ads_1.Ads();
    ads.title = parse.detail.title;
    ads.description = parse.detail.description;
    ads.price = parse.detail.price;
    ads.img = parse.imgHref;
    ads.deliveryPrice = String(ctx.session.tgId);
    ads.link = `${match[2]}${date}`;
    ads.originallink = `${match[2]}`;
    ads.date = `${date}`;
    ads.country = match[1];
    ads.service = 'jofogas';
    ads.author = ctx.user;
    ads.profile = profile;
    ads.page = parse.page;
    ads.pageMobile = parse.pageMobile;
    ads.created = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    await database_1.adsRepository.save(ads);
    return {
        ads,
        newAd: true
    };
};
