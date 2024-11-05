"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
const regex = /tag change/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('change-username');
}
exports.scene = new grammy_scenes_1.Scene('change-username');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel change-username', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    const response = await ctx.reply(`Введите новый <b>tag</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel change-username' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/(?<tag>.+)/gmsi, async (ctx) => {
    const match = /(?<tag>.+)/gmsi.exec(ctx.message.text);
    const newTag = match.groups.tag;
    ctx.session.deleteMessage.push(ctx.message.message_id);
    if (newTag.length > 15) {
        await ctx.reply('Длина не может превышать 8 символов', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    ctx.user.tag = newTag;
    await database_1.userRepository.save(ctx.user);
    await cancel(ctx);
    return ctx.reply(`👍Твой тэг успешно изменен на <b>${ctx.user.tag}</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
});
