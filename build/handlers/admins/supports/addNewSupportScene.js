"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSupportScene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const database_1 = require("../../../database");
const supports_1 = require("../../../database/models/supports");
exports.composer = new grammy_1.Composer();
const regex = /admin support create (?<tgid>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    if (match?.groups?.tgid) {
        return ctx.scenes.enter('support-add', match?.groups?.tgid);
    }
}
exports.addSupportScene = new grammy_scenes_1.Scene('support-add');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.addSupportScene.always().callbackQuery('cancel support-add', cancel);
exports.addSupportScene.use(async (ctx, next) => {
    ctx.session.tgId = ctx.scene.opts.arg;
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(ctx.callbackQuery.message.message_id);
    ctx.deleteMessage();
    const mentor = await database_1.supportsRepository.findOne({
        relations: { user: true },
        where: {
            user: {
                tgId: ctx.session.tgId
            }
        }
    });
    if (mentor) {
        await ctx.editMessageText(`
ТПшер уже сущестувет
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
    ctx.session.supports = { percent: undefined, code: undefined, description: undefined };
    ctx.session.deleteMessage = [];
    return next();
});
exports.addSupportScene.do(async (ctx) => {
    const response = await ctx.reply(`Введите процент ТПшера`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel support-add' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.addSupportScene.wait().hears(/(^\d\d)|(^\d)/, async (ctx) => {
    ctx.session.supports.percent = Number(ctx.match[0]);
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const response = await ctx.reply(`Введите описание`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel support-add' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.addSupportScene.wait().on('message:text', async (ctx) => {
    ctx.session.supports.description = ctx.msg.text;
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const response = await ctx.reply(`Введите код`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel support-add' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.addSupportScene.wait().on('message:text', async (ctx) => {
    ctx.session.supports.code = ctx.msg.text;
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    console.log(ctx.session.supports);
    const user = await database_1.userRepository.findOne({ where: { tgId: ctx.session.tgId } });
    const newSupport = new supports_1.Supports();
    newSupport.code = ctx.session.supports.code;
    newSupport.percent = ctx.session.supports.percent;
    newSupport.description = ctx.session.supports.description;
    newSupport.user = user;
    await database_1.supportsRepository.save(newSupport);
    user.supportUser = newSupport;
    user.supportCode = '';
    await database_1.userRepository.save(user);
    await ctx.reply(`ТПшер успешно добавлен`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
