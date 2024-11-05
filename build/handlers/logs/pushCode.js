"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = exports.scene = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const lonelypups_1 = require("../../database/lonelypups");
exports.scene = new grammy_scenes_1.Scene('pushError');
exports.composer = new grammy_1.Composer();
const regex = /log set error (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const id = match.groups.id;
    await ctx.scenes.enter('pushError', {
        id
    });
}
exports.scene.always().callbackQuery('cancel pushError', async (ctx) => {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
});
exports.scene.do(async (ctx) => {
    ctx.session.logId = Number(ctx.scene.opts.arg.id);
    const msg = await ctx.reply("<b>⁉️ Введи текст:</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel pushError')
    });
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
});
exports.scene.wait().hears(/.+/gmi, async (ctx) => {
    try {
        ctx.deleteMessage();
    }
    catch (e) { }
    const log = await lonelypups_1.lonelyRepository.getOrder(ctx.session.logId);
    await lonelypups_1.lonelyRepository.setOrder(Number(ctx.session.logId), {
        status: "wait",
        error: ctx.message.text
    });
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
    await ctx.reply(`
#ID_${log.id}

👍 Запрос на <b>ошибку с текстом</b> отправлен
`, {
        reply_to_message_id: log["messageId"],
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Закрыть', 'deleteThisMessage')
    });
});
