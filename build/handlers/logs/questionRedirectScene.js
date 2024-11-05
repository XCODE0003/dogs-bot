"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = exports.scene = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const bot_1 = require("../../utils/bot");
const getUsername_1 = require("../../helpers/getUsername");
exports.scene = new grammy_scenes_1.Scene('logRedirectQuestion');
exports.composer = new grammy_1.Composer();
const regex = /log redirect question (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = match.groups.id;
    await ctx.scenes.enter('logRedirectQuestion', {
        id
    });
}
exports.scene.always().callbackQuery('cancel logRedirectQuestion', async (ctx) => {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
});
exports.scene.do(async (ctx) => {
    ctx.session.logId = Number(ctx.scene.opts.arg.id);
    const msg = await ctx.reply("<b>⁉️ Введи текст или вопрос:</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel logRedirectQuestion')
    });
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
});
exports.scene.wait().on("message:text", async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.session.text = ctx.msg.text;
    const res = await ctx.reply(`<code>${ctx.msg.text}</code>`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('С кнопкой', 'btn')
            .text('БЕЗ кнопки', 'without btn')
            .row()
            .text('Отмена', 'cancel logRedirectQuestion')
    });
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('callback_query:data', async (ctx) => {
    console.log(ctx);
    const log = await database_1.logsRepository.findOne({
        relations: ['ad', 'ad.author', 'ad.acceptedLog'],
        where: { id: ctx.session.logId }
    });
    log.question = ctx.session.text.replaceAll('\n', '<br/>');
    log.redirectTo = 'question';
    log.questionBtn = ctx.callbackQuery.data === 'btn';
    await database_1.logsRepository.save(log);
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
    await ctx.answerCallbackQuery({
        text: `
👍 Запрос на редирект "Свой вопрос" успешно отправлен
`.replace(`\n`, ''),
        show_alert: true
    });
    await bot_1.notificationBot.api.sendMessage(log.ad?.author?.tgId, `🔔 ${await (0, getUsername_1.getUsername)(log.ad.acceptedLog)} Выполнил перевод на свой вопрос`, {
        reply_to_message_id: log.msgWorkerId
    });
});
