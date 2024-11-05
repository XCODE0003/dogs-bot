"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorChangePofitCount = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../../helpers/deleteAllMessages");
const database_1 = require("../../../../database");
exports.composer = new grammy_1.Composer();
const regex = /mentor change profitCount (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('mentor-change-profitCount');
}
exports.mentorChangePofitCount = new grammy_scenes_1.Scene('mentor-change-profitCount');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.mentorChangePofitCount.always().callbackQuery('cancel mentor-change-profitCount', cancel);
exports.mentorChangePofitCount.do(async (ctx) => {
    ctx.session.mentors = { description: undefined, percent: undefined };
    ctx.session.deleteMessage = [];
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const response = await ctx.reply(`🐨 Введите нужное кол-во профитов:`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel mentor-change-profitCount' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.mentorChangePofitCount.wait().hears(/(^\d+)/, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    ctx.session.mentors.freedom = Number(/(^\d+)/.exec(ctx.msg.text)[1]);
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
    mentor.freedom = ctx.session.mentors.freedom;
    await database_1.mentorsRepository.save(mentor);
    await ctx.reply('Кол-во профитов успешно изменено', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
