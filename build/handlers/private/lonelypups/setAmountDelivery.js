"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLonelypupsAmount = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const regex = /private lonelypups set amount (?<id>\d+)/g;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    const id = Number(ctx.match[1]);
    return ctx.scenes.enter('private lonelypups set amount');
}
exports.setLonelypupsAmount = new grammy_scenes_1.Scene('private lonelypups set amount');
exports.setLonelypupsAmount.always().callbackQuery('private lonelypupsamount', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
});
exports.setLonelypupsAmount.do(async (ctx) => {
    ctx.session.logId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const msg = await ctx.reply(`🧢 <b>Новая цена доставки:</b>`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'private lonelypupsamount')
    });
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
});
exports.setLonelypupsAmount.wait().hears(/(^\d+\.\d\d)|(^\d+)/g, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const userPrice = parseFloat(ctx.match[0]);
    ctx.session.tgId = parseFloat(ctx.match[0]);
    const lonelyEmail = await database_1.lonelypupsRepository.findOne({
        where: {
            id: ctx.session.logId
        }
    });
    lonelyEmail.deliveryPrice = ctx.session.tgId;
    await database_1.lonelypupsRepository.save(lonelyEmail);
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
    return ctx.reply(`✅ Цена успешно обновлена!`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Закрыть', `deleteThisMessage`)
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
