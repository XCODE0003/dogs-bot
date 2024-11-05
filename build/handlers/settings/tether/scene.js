"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTetherScene = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
exports.setTetherScene = new grammy_scenes_1.Scene('setTether-scene');
exports.setTetherScene.always().callbackQuery('cancel setTether', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
});
exports.setTetherScene.do(async (ctx) => {
    const msg = await ctx.reply("Отправьте <code>Tether(TRC-20)</code> адрес", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel setTether')
    });
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
});
exports.setTetherScene.wait().on("message:text", async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.user.trcAddress = ctx.msg.text;
    await database_1.userRepository.save(ctx.user);
    ctx.scene.exit();
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    return ctx.reply(`🌳 <code>Tether (TRC-20)</code>
<code>${ctx.user.trcAddress}</code>`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Закрыть', 'deleteThisMessage')
    });
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
