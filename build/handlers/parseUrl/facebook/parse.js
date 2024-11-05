"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_1 = require("grammy");
// import {parseStringFacebook} from "../../../handlers/parseUrl/facebook/parseStringFacebook";
const ads_1 = require("../../../database/models/ads");
const database_1 = require("../../../database");
const moment_1 = __importDefault(require("moment"));
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
const grammy_scenes_1 = require("grammy-scenes");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const getFlagEmoji_1 = require("../../../helpers/getFlagEmoji");
const getServices_1 = require("../../../helpers/getServices");
const parseStringFacebook_1 = require("../../../handlers/parseUrl/facebook/parseStringFacebook");
const getDomen_1 = require("../../../helpers/getDomen");
exports.composer = new grammy_1.Composer();
const regex = /facebook\.(?<platform>com)\/(?<link>.+)\//gm;
exports.composer.hears(regex, handler);
moment_1.default.locale('ru');
async function preCreateAd(ctx, parse, match, profileId) {
    const profile = await database_1.profilesRepository.findOne({
        where: { id: profileId }
    });
    if (!profile)
        return ctx.reply('profile undefined error');
    const { ads, newAd } = await createAd(parse, ctx, match, profile);
    const domen = await (0, getDomen_1.getDomen)(ctx.user, 'facebook');
    if (!domen)
        return ctx.reply('domen undefined error');
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: `
${(newAd) ? '🪄 Ссылка создана!' : '🪄 Ссылка была создана ранее!'}

🐨 ID объявления: <code>${ads.date}</code>

🌳 <b>Название:</b> <code>${ads.title}</code>
🌳 <b>Цена:</b> <code>${ads.price}</code>
🌳 <b>Платформа: FACEBOOK [HU 🇭🇺]</b>
♻️ <b>Домен сменён ${(0, moment_1.default)(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>FACEBOOK:</b> <a href="https://${domen.link}/link/${ads.link}">LINK [2.0]</a>

🚚 <b>FOXPOST:</b> <a href="https://${domen.link}/service/foxpost/${ads.link}">FOXPOST LINK</a>
🚚 <b>GLS:</b> <a href="https://${domen.link}/service/gls/${ads.link}">GLS LINK</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ads.id, ctx.user)
    });
}
const createKeyboard = async (id, user) => {
    const keyb = new grammy_1.InlineKeyboard();
    // .text("🙊 Настройки", `settings ad ${id}`)
    keyb.row();
    keyb.text("📲 SMS", `sms facebook hu ad ${id}`);
    keyb.text("💌 EMAIL", `email facebook hu ad ${id}`);
    keyb.row();
    keyb.text("⚙ Настройки", `settings ad ${id}`);
    keyb.row();
    keyb.text("Главное меню", `menuWithPicture`);
    return keyb;
};
async function handler(ctx) {
    const match = regex.exec(ctx.msg.text);
    const parse = await (0, parseStringFacebook_1.parseStringFacebook)(`https://facebook.com/${match.groups.link}`, ctx);
    if (parse === undefined)
        return null;
    match[1] = 'hu';
    match.groups['platform'] = 'hu';
    return ctx.scenes.enter('setDeliveryAmountFacebook', {
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
exports.scene = new grammy_scenes_1.Scene('setDeliveryAmountFacebook');
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    ctx.session.anyObject = ctx.scene.arg;
    const res = await ctx.reply(
    // @ts-ignore
    `${(0, getFlagEmoji_1.getFlagEmoji)(ctx.session.anyObject?.match?.[1])} <b>FACEBOOK</b>\nИтоговая цена: <code>${ctx.session.anyObject?.parse?.detail?.price}</code>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Указать цену доставки', callback_data: 'no skip' }],
                [{ text: 'Пропустить', callback_data: 'skip' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    return ctx.scene.resume();
});
exports.scene.wait().callbackQuery(/skip|no skip/, async (ctx) => {
    try {
        ctx.deleteMessage();
    }
    catch (e) { }
    if (ctx.callbackQuery.data === 'no skip') {
        const res = await ctx.reply(`🌱 <b>Введи цену доставки:</b>
<code>Пример: 23.99</code>`, {});
        ctx.session.deleteMessage.push(res.message_id);
    }
    else {
        return ctx.scene.goto('choiceProfile');
    }
    return ctx.scene.resume();
});
exports.scene.wait().hears(/(^\d+\.\d\d)|(^\d+)/, async (ctx) => {
    try {
        ctx.session.deleteMessage.push(ctx.msg.message_id);
    }
    catch (e) { }
    const userPrice = parseInt(ctx.match[0]);
    // @ts-ignore
    const price = parseInt(String(ctx.session.anyObject.parse.detail.price).replace(/ /g, ''));
    const newPrice = `${userPrice + price}`.split('').reverse().map((el, index) => index % 3 !== 2 ? el : ` ${el}`).reverse().join('') + ' ft';
    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = newPrice;
    ctx.scene.resume();
});
exports.scene.label('choiceProfile');
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const service = (0, getServices_1.getService)('facebook');
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
});
const createAd = async (parse, ctx, match, profile) => {
    const oldAd = await database_1.adsRepository.findOne({
        relations: { author: true },
        where: {
            originallink: match[2],
            country: match[1],
            service: 'facebook',
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
    ads.price = parse.detail.price;
    ads.img = parse.imgHref;
    ads.link = `${match[2]}${date}`;
    ads.originallink = `${match[2]}`;
    ads.date = `${date}`;
    ads.country = match[1];
    ads.profile = profile;
    ads.service = 'facebook';
    ads.author = ctx.user;
    ads.created = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    await database_1.adsRepository.save(ads);
    return {
        ads,
        newAd: true
    };
};
