"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePercentScene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../../helpers/deleteAllMessages");
const database_1 = require("../../../../database");
exports.composer = new grammy_1.Composer();
const regex = /mentor change percent (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    console.log('asd');
    return ctx.scenes.enter('mentor-change-percent');
}
exports.changePercentScene = new grammy_scenes_1.Scene('mentor-change-percent');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.changePercentScene.always().callbackQuery('cancel mentor-change-percent', cancel);
exports.changePercentScene.do(async (ctx) => {
    ctx.session.mentors = { description: undefined, percent: undefined };
    ctx.session.deleteMessage = [];
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const response = await ctx.reply(`Введите новый процент для этого наставника`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel mentor-change-percent' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.changePercentScene.wait().hears(/^\d\d|^\d/gmi, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    ctx.session.mentors.percent = Number(ctx.match[0]);
    const mentor = await database_1.mentorsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    });
    if (!mentor) {
        await ctx.reply('Mentor undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    mentor.percent = ctx.session.mentors.percent;
    await database_1.mentorsRepository.save(mentor);
    await ctx.reply('Процент успешно изменен', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
