"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const user_1 = require("../../database/models/user");
const setupSession_1 = require("../../utils/setupSession");
const config_1 = require("../../utils/config");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
const regex = /apply/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    await ctx.deleteMessage();
    return ctx.scenes.enter('apply');
}
exports.scene = new grammy_scenes_1.Scene('apply');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    setupSession_1.redis.set(`cons-${ctx.from.id}`, '0');
    setupSession_1.redis.save();
    try {
        ctx.scene.exit();
    }
    catch (e) { }
    return ctx.reply(`<b>Нажми на кнопку.</b>
<b>Контакт на случай проблем с подачей заявки</b> @scarllet_dev
`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '♻️', callback_data: 'apply' }]
            ]
        }
    });
}
async function cancel2(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    setupSession_1.redis.set(`cons-${ctx.from.id}`, '0');
    setupSession_1.redis.save();
    try {
        ctx.scene.exit();
    }
    catch (e) { }
}
exports.scene.always().callbackQuery('cancel apply', cancel);
exports.scene.do(async (ctx) => {
    setupSession_1.redis.set(`cons-${ctx.from.id}`, '1');
    setupSession_1.redis.save();
    ctx.session.deleteMessage = [];
    ctx.session.text = `<b>Новая заявка</b>\n\n <b>User:</b> @${ctx.from?.username} [${ctx.from.id}]`;
    if (ctx.user.role !== user_1.UserRole.RANDOM) {
        return ctx.reply(`😔 Тебе уже нельзя подать заявку`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    const response = await ctx.reply(`
От кого узнал о нас (укажи тг)
`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel apply' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('message', async (ctx) => {
    ctx.session.text += `\n\n1. ${ctx.msg.text}`;
    const response = await ctx.reply(`
Где раньше воркал?`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel apply' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('message:text', async (ctx) => {
    ctx.session.text += `\n2. ${ctx.msg.text}`;
    const response = await ctx.reply(`
Почему ушел из предыдущей команды?`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel apply' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.scene.resume();
});
exports.scene.wait().on('message:text', async (ctx) => {
    ctx.session.text += `\n3. ${ctx.msg.text}`;
    await ctx.api.sendMessage(config_1.config.chats.applications, ctx.session.text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🪴 Принять', callback_data: `admin accept ${ctx.from.id}` }],
                [{ text: '🐾 Отклонить', callback_data: `admin decline ${ctx.from.id}` }]
            ]
        }
    })
        .then(async (res) => {
        ctx.user.role = user_1.UserRole.CONSIDERATION;
        await database_1.userRepository.save(ctx.user);
        setupSession_1.redis.set(`cons-${ctx.from.id}`, '0');
        setupSession_1.redis.save();
        await ctx.reply(`
<b>Заявка подана, ожидай проверку!</b>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        ctx.session.deleteMessage.push(ctx.msg.message_id);
        return cancel2(ctx);
    })
        .catch(async (error) => {
        setupSession_1.redis.set(`cons-${ctx.from.id}`, '0');
        setupSession_1.redis.save();
        await cancel(ctx);
        return await ctx.reply(`
<b>⚠️ Не удалось отправить заявку, попробуйте заново</b>\n ${error.toString()}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '♻️ Заново', callback_data: 'apply' }],
                ]
            }
        });
    });
});
