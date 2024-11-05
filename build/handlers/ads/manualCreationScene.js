"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const ads_1 = require("../../database/models/ads");
const database_1 = require("../../database");
const getPictureMenu_1 = require("../../helpers/getPictureMenu");
const moment_1 = __importDefault(require("moment/moment"));
exports.composer = new grammy_1.Composer();
const regex = /^ad manual creation (?<service>\w+-\w+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('manualCreationAd');
}
exports.scene = new grammy_scenes_1.Scene('manualCreationAd');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel manualCreationAd', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.createAdManual = {};
    ctx.session.deleteMessage = [];
    ctx.session.service = regex.exec(ctx.callbackQuery.data).groups.platform;
    const res = await ctx.reply(`<b>🇩🇪 Введи название товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd' }]
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
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/(^\d+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.createAdManual.price = ctx.match[1] + ' €';
    const res = await ctx.reply(`<b>💬 Введи описание товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/(^.+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.createAdManual.description = ctx.msg.text;
    const res = await ctx.reply(`<b>🌌 Введи ссылку на изображение (воспользуйся @imgur_linkbot):</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel manualCreationAd' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.session.tgId = res.message_id;
    ctx.scene.resume();
});
exports.scene.wait().hears(/(^.+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.createAdManual.img = ctx.match[1];
    ctx.scene.resume();
});
exports.scene.do(async (ctx) => {
    try { }
    catch (e) { }
    const date = Date.now();
    const ad = new ads_1.Ads();
    ad.price = ctx.session.createAdManual.price;
    ad.title = ctx.session.createAdManual.title;
    ad.description = ctx.session.createAdManual.description;
    ad.img = ctx.session.createAdManual.img;
    ad.link = `s-anzeige/zuchtstute-praemienstute/2333383018-${date}`;
    ad.originallink = 'none';
    ad.date = `${date}`;
    ad.country = 'de';
    ad.service = 'ebay';
    ad.author = ctx.user;
    ad.manualCreation = true;
    await database_1.adsRepository.save(ad);
    const domen = await database_1.domensRepository.findOneBy({ active: true, service: `ebay`, country: 'de' });
    if (!domen)
        return ctx.reply('domen undefined error');
    await ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        caption: `
${(ad) ? '🪄 Ссылка создана!' : '🪄 Ссылка была создана ранее!'}

🐨 ID объявления: <code>${ad.date}</code>

🌳 <b>Название:</b> <code>${ad.title}</code>
🌳 <b>Цена:</b> <code>${ad.price}</code>
🌳 <b>Платформа: [EBAY DE 🇩🇪]</b>
♻️ <b>Домен сменён ${(0, moment_1.default)(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ad.link}">LINK [2.0]</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ad.id, ctx.user)
    });
    ctx.scene.exit();
});
const createKeyboard = async (id, user) => {
    const keyb = new grammy_1.InlineKeyboard();
    // .text("🙊 Настройки", `settings ad ${id}`)
    keyb.row();
    keyb.text("📲 SMS", `sms ad ${id}`);
    keyb.text("💌 EMAIL", `email ad ${id}`);
    keyb.row();
    keyb.text("⚙ Настройки", `settings ad ${id}`);
    keyb.row();
    keyb.text("Главное меню", `menuWithPicture`);
    return keyb;
};
