"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
const regex = /^support update code/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('support-update-code');
}
exports.scene = new grammy_scenes_1.Scene('support-update-code');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel support-update-code', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    const response = await ctx.reply(`
🍃 Отправь свой <a href="https://www.smartsupp.com/"><b>Smartsupp</b></a> код

<a href="https://telegra.ph/Nastrojka-Smartsupp-10-06"><b>Гайд</b></a>, как настроить и установить 
`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel support-update-code' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/\w+/gmi, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    ctx.user.supportCode = ctx.msg.text;
    await database_1.userRepository.save(ctx.user);
    await ctx.reply('Код успешно изменен', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
