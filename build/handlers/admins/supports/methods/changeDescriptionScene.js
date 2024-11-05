"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDescSceneSupport = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../../helpers/deleteAllMessages");
const database_1 = require("../../../../database");
exports.composer = new grammy_1.Composer();
const regex = /support change description (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('support-change-desc');
}
exports.changeDescSceneSupport = new grammy_scenes_1.Scene('support-change-desc');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.changeDescSceneSupport.always().callbackQuery('cancel support-change-desc', cancel);
exports.changeDescSceneSupport.do(async (ctx) => {
    ctx.session.supports = { code: undefined, percent: undefined, description: undefined };
    ctx.session.deleteMessage = [];
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const response = await ctx.reply(`Введите новое описание для ТП`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel support-change-desc' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.changeDescSceneSupport.wait().on("message:text", async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    ctx.session.supports.description = ctx.message.text;
    const support = await database_1.supportsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    });
    if (!support) {
        await ctx.reply('Support undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    support.description = ctx.session.supports.description;
    await database_1.supportsRepository.save(support);
    await ctx.reply('Описание успешно изменено', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
