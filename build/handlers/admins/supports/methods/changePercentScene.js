"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePercentSceneSupport = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../../helpers/deleteAllMessages");
const database_1 = require("../../../../database");
exports.composer = new grammy_1.Composer();
const regex = /^support change percent (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('support-change-percent');
}
exports.changePercentSceneSupport = new grammy_scenes_1.Scene('support-change-percent');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.changePercentSceneSupport.always().callbackQuery('cancel support-change-percent', cancel);
exports.changePercentSceneSupport.do(async (ctx) => {
    ctx.session.supports = { code: undefined, percent: undefined, description: undefined };
    ctx.session.deleteMessage = [];
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const response = await ctx.reply(`Введите новый процент для ТП`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel support-change-percent' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.changePercentSceneSupport.wait().hears(/^\d\d|^\d/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    console.log(Number(ctx.match[0]), ctx.match, ctx.match[0]);
    ctx.session.supports.percent = Number(ctx.match[0]);
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
    support.percent = ctx.session.supports.percent;
    await database_1.supportsRepository.save(support);
    await ctx.reply('Процент успешно изменен', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
