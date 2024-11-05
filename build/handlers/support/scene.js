"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSupCode = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.setSupCode = new grammy_scenes_1.Scene('setSupportCode-scene');
exports.setSupCode.always().callbackQuery('cancel setSupportCode', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    return ctx.scene.exit();
});
exports.setSupCode.do(async (ctx) => {
    const msg = await ctx.reply(`
🍃 Отправь свой <a href="https://www.smartsupp.com/"><b>Smartsupp</b></a> код

<a href="https://www.google.com/"><b>Гайд</b></a>, как настроить и установить`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel setSupportCode')
    });
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
});
exports.setSupCode.wait().on("message:text", async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.user.supportCode = ctx.msg.text;
    ctx.user.supportCode = null;
    await ctx.reply(`✅ <b>Smartsupp код</b>
<code>${ctx.user.supportCode}</code>`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Закрыть', 'deleteThisMessage')
    });
    try {
        if (ctx.user.supportTeam) {
            ctx.user.supportTeam = false;
        }
    }
    catch (e) { }
    await database_1.userRepository.save(ctx.user);
    ctx.scene.exit();
    return deleteAllMessages(ctx.session.deleteMessage, ctx);
});
async function deleteAllMessages(array, ctx) {
    for (const id of array) {
        try {
            await ctx.api.deleteMessage(ctx.chat.id, id).catch();
        }
        catch (e) {
            console.log(e);
        }
    }
}
