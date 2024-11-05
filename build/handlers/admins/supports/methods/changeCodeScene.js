"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCodeSceneSupport = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../../helpers/deleteAllMessages");
const database_1 = require("../../../../database");
exports.composer = new grammy_1.Composer();
const regex = /support change code (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('support-change-code');
}
exports.changeCodeSceneSupport = new grammy_scenes_1.Scene('support-change-code');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.changeCodeSceneSupport.always().callbackQuery('cancel support-change-code', cancel);
exports.changeCodeSceneSupport.do(async (ctx) => {
    ctx.session.supports = { code: undefined, description: undefined, percent: undefined };
    ctx.session.deleteMessage = [];
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const response = await ctx.reply(`Введите новый код для этого наставника`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel support-change-code' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.changeCodeSceneSupport.wait().hears(/.+/gmi, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    ctx.session.supports.code = ctx.msg.text;
    const sup = await database_1.supportsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    });
    if (!sup) {
        await ctx.reply('Support undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    sup.code = ctx.session.supports.code;
    await database_1.supportsRepository.save(sup);
    await ctx.reply('Процент успешно изменен', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
