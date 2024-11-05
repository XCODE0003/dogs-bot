"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMentorScene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const database_1 = require("../../../database");
const getUsername_1 = require("../../../helpers/getUsername");
const mentors_1 = require("../../../database/models/mentors");
exports.composer = new grammy_1.Composer();
const regex = /admin mentor create (?<tgid>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    if (match?.groups?.tgid) {
        return ctx.scenes.enter('mentors-add', match?.groups?.tgid);
    }
}
exports.addMentorScene = new grammy_scenes_1.Scene('mentors-add');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.addMentorScene.always().callbackQuery('cancel mentors-add', cancel);
exports.addMentorScene.use(async (ctx, next) => {
    ctx.session.tgId = ctx.scene.opts.arg;
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(ctx.callbackQuery.message.message_id);
    ctx.deleteMessage();
    const mentor = await database_1.mentorsRepository.findOne({
        relations: { user: true },
        where: {
            user: {
                tgId: ctx.session.tgId
            }
        }
    });
    if (mentor) {
        await ctx.editMessageText(`
Наставник уже сущестувет
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return ctx.scene.exit();
    }
    const user = await database_1.userRepository.findOne({
        where: {
            tgId: ctx.session.tgId
        }
    });
    if (!user) {
        await ctx.editMessageText(`
Пользователь не зарегестрирован в боте
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return ctx.scene.exit();
    }
    ctx.session.mentors = { description: undefined, percent: undefined, freedom: undefined };
    return next();
});
exports.addMentorScene.do(async (ctx) => {
    ctx.session.mentors = { description: undefined, percent: undefined, freedom: undefined };
    ctx.session.deleteMessage = [];
    const response = await ctx.reply(`Введите описание для этого наставника`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel mentors-add' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.addMentorScene.wait().on("message:text", async (ctx) => {
    ctx.session.mentors.description = ctx.msg.text;
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const response = await ctx.reply(`Введите процент который будет получать наставник`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel mentors-add' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.addMentorScene.wait().hears(/^\d\d|^\d/, async (ctx, next) => {
    ctx.session.mentors.percent = Number(ctx.match[0]);
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const response = await ctx.reply(`Введите через сколько профитов, ученик сможет уйти`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel mentors-add' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.addMentorScene.wait().hears(/(^\d)/, async (ctx, next) => {
    ctx.session.mentors.freedom = Number(/(^\d)/.exec(ctx.msg.text)[1]);
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const user = await database_1.userRepository.findOne({
        where: {
            tgId: ctx.session.tgId
        }
    });
    const response = await ctx.reply(`Наставник ${await (0, getUsername_1.getUsername)(user, true)}\nПроцент: ${ctx.session.mentors.percent}%\nПрофит: ${ctx.session.mentors.freedom}\n\n${ctx.session.mentors.description}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👍 Добавить', callback_data: 'scene mentor accept' }],
                [{ text: 'Отмена', callback_data: 'cancel mentors-add' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.addMentorScene.wait().callbackQuery(/scene mentor accept/, async (ctx) => {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    const user = await database_1.userRepository.findOne({ where: { tgId: ctx.session.tgId } });
    const newMentor = new mentors_1.Mentors();
    newMentor.description = ctx.session.mentors.description;
    newMentor.percent = ctx.session.mentors.percent;
    newMentor.user = user;
    newMentor.freedom = ctx.session.mentors.freedom;
    newMentor.active = true;
    await database_1.mentorsRepository.save(newMentor);
    await ctx.reply('Наставник успешно создан', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    ctx.scene.exit();
});
