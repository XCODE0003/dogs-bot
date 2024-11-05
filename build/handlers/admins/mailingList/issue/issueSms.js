"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../../helpers/deleteAllMessages");
const database_1 = require("../../../../database");
exports.composer = new grammy_1.Composer();
const regex = /sms issue (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('sms-issue');
}
exports.scene = new grammy_scenes_1.Scene('sms-issue');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel sms-issue', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.mentors = { description: undefined, percent: undefined };
    ctx.session.deleteMessage = [];
    ctx.session.tgId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const response = await ctx.reply(`Сколько вы хотите выдать смс?`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel sms-issue' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.scene.wait().hears(/(?<num>\d+)/gmi, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    const num = Number(/(?<num>\d+)/gmi.exec(ctx.message.text).groups.num);
    const user = await database_1.userRepository.findOne({
        where: {
            tgId: ctx.session.tgId
        }
    });
    if (!user) {
        await ctx.reply('user undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    user.sms = user.sms + num;
    await database_1.userRepository.save(user);
    await ctx.reply('СМС успешно выданы', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
