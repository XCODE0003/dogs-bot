"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const database_1 = require("../../../database");
const getServices_1 = require("../../../helpers/getServices");
const getFlagEmoji_1 = require("../../../helpers/getFlagEmoji");
exports.composer = new grammy_1.Composer();
const regex = /ad profile (?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('ad-set-profile');
}
exports.scene = new grammy_scenes_1.Scene('ad-set-profile');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.scene.always().callbackQuery('cancel ad-set-profile', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.deleteMessage = [];
    ctx.session.logId = Number(regex.exec(ctx.callbackQuery.data).groups.id);
    const ad = await database_1.adsRepository.findOne({
        where: {
            id: ctx.session.logId
        }
    });
    if (!ad) {
        await ctx.scene.exit();
        return ctx.reply('ad undefined');
    }
    const service = (0, getServices_1.getService)(ad.service);
    const country = ad.country;
    const keyboard = new grammy_1.InlineKeyboard();
    const profiles = await database_1.profilesRepository.find({
        relations: { user: true },
        where: {
            service: service.name,
            country: country,
            user: {
                tgId: ctx.user.tgId
            }
        }
    });
    if (profiles.length === 0) {
        return ctx.reply(`
<b>${(0, getFlagEmoji_1.getFlagEmoji)(country)} ${service.name.toUpperCase()}</b>
Тут у тебя нет профилей`, {
            reply_markup: {
                inline_keyboard: [
                    // [{text: 'Создать', callback_data: 'adasdasd'}],
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    profiles.slice(0, 9);
    for (const i in profiles) {
        const profile = profiles[i];
        if (i === '3' || i === '6' || i === '9') {
            keyboard.row();
        }
        keyboard.text(`${(profile.fullName.length > 9) ? profile.fullName.slice(0, 9) + '...' : profile.fullName}`, `profile ${profile.id}`);
    }
    keyboard.row();
    keyboard.text(`Отмена`, `cancel ad-set-profile`);
    const response = await ctx.reply(`🐨 <b>Выбери профиль</b>`, {
        reply_markup: keyboard
    });
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.scene.wait().callbackQuery(/^profile (?<id>\d+)$/gmi, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    const ad = await database_1.adsRepository.findOne({
        where: {
            id: ctx.session.tgId
        }
    });
    if (!ad)
        return ctx.reply(`ad undefined`);
    const profile = await database_1.profilesRepository.findOne({
        where: {
            id: Number(/^profile (?<id>\d+)$/gmi.exec(ctx.callbackQuery.data).groups.id)
        }
    });
    if (!profile)
        return ctx.reply(`profile undefined`);
    ad.profile = profile;
    await database_1.adsRepository.save(ad);
    await ctx.reply(`✅ <b>Новый профиль</b> <code>${profile.fullName}</code>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
    return cancel(ctx);
});
