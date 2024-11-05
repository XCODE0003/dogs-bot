"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProfileData = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
const regex = /profile set (?<data>\w+) (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    const match = regex.exec(ctx.match[0]);
    const data = match.groups.data;
    const id = Number(match.groups.id);
    return ctx.scenes.enter('profiles-set-data', {
        data, id
    });
}
exports.setProfileData = new grammy_scenes_1.Scene('profiles-set-data');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.setProfileData.always().callbackQuery('cancel profiles-set-data', cancel);
exports.setProfileData.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    let name = undefined;
    if (ctx.scene.opts.arg.data === 'fullname') {
        name = "<b>Фио</b>";
    }
    else if (ctx.scene.opts.arg.data === 'delivery') {
        name = "<b>Доставка</b>";
    }
    else if (ctx.scene.opts.arg.data === 'phone') {
        name = "<b>Номер телефона</b>";
    }
    const response = await ctx.reply(`Введи новое значение для ${name}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: "cancel profiles-set-data" }]
            ]
        }
    });
    ctx.session.profile = ctx.scene.opts.arg;
    ctx.session.deleteMessage.push(response.message_id);
});
exports.setProfileData.wait().on('message:text', async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    const profile = await database_1.profilesRepository.findOne({
        where: {
            id: ctx.session.profile.id
        }
    });
    if (!profile) {
        await cancel(ctx);
        return ctx.reply(`Профиль не найден`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: "deleteThisMessage" }]
                ]
            }
        });
    }
    switch (ctx.session.profile.data) {
        case 'phone':
            profile.phone = ctx.message.text;
            break;
        case 'fullname':
            profile.fullName = ctx.message.text;
            break;
        case 'delivery':
            profile.delivery = ctx.message.text;
            break;
        default:
            await cancel(ctx);
            return ctx.reply(`Неизвестная ошибка \n\n${JSON.stringify(ctx.session.profile)}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Закрыть', callback_data: "deleteThisMessage" }]
                    ]
                }
            });
    }
    await database_1.profilesRepository.save(profile);
    await cancel(ctx);
    return ctx.reply(`Данные успешно изменены`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: "deleteThisMessage" }]
            ]
        }
    });
});
