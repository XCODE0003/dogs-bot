"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorChangeDesc = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../../helpers/deleteAllMessages");
const database_1 = require("../../../../database");
exports.composer = new grammy_1.Composer();
const regex = /mentor change description (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('mentor-change-description');
}
exports.mentorChangeDesc = new grammy_scenes_1.Scene('mentor-change-description');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.mentorChangeDesc.always().callbackQuery('cancel mentor-change-description', cancel);
exports.mentorChangeDesc.do(async (ctx) => {
    ctx.session.mentors = { description: undefined, percent: undefined };
    ctx.session.deleteMessage = [];
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const response = await ctx.reply(`Введите новое описание для этого наставника`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel mentor-change-description' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.mentorChangeDesc.wait().on('message:text', async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    ctx.session.mentors.description = ctx.message.text;
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
    mentor.description = ctx.session.mentors.description;
    await database_1.mentorsRepository.save(mentor);
    await ctx.reply('Описание успешно изменено', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
