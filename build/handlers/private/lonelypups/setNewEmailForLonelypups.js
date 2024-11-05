"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLonelypupsEmail = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const lonelypups_1 = require("../../../database/models/lonelypups");
const userEmails_1 = require("../../../handlers/private/lonelypups/userEmails");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('private lonelypups set email', startScene);
async function startScene(ctx) {
    const emails = await database_1.lonelypupsRepository.find({
        where: {
            author: String(ctx.user.tgId)
        }
    });
    if (emails.length > 4) {
        return ctx.answerCallbackQuery({
            show_alert: true,
            text: 'Максимум можно создать 4 почты'
        });
    }
    return ctx.scenes.enter('private lonelypups set email');
}
exports.setLonelypupsEmail = new grammy_scenes_1.Scene('private lonelypups set email');
exports.setLonelypupsEmail.always().callbackQuery('cancel lonelypupsemail', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
});
exports.setLonelypupsEmail.do(async (ctx) => {
    const msg = await ctx.reply("🐾 Отправь свою почту для <b>PET TAXI</b>", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel lonelypupsemail')
    });
    ctx.session.deleteMessage = [];
    ctx.session.deleteMessage.push(msg.message_id);
    ctx.scene.resume();
});
exports.setLonelypupsEmail.wait().hears(/(?<email>^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$)/g, async (ctx) => {
    const ttt = /(?<email>^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$)/g.exec(ctx.msg.text);
    const lonely = await database_1.lonelypupsRepository.findOne({
        where: {
            email: ttt.groups.email
        }
    });
    if (lonely) {
        if (lonely.author !== String(ctx.from.id)) {
            return ctx.reply(`Используется другим воркером`, {
                reply_markup: new grammy_1.InlineKeyboard()
                    .text('Отмена', 'cancel lonelypupsemail')
            });
        }
        return ctx.reply(`Уже используется вами `, {
            reply_markup: new grammy_1.InlineKeyboard()
                .text('Отмена', 'cancel lonelypupsemail')
        });
    }
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    ctx.session.text = ttt.groups.email;
    await ctx.reply(`🧢 <b>Цена доставки:</b>`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Отмена', 'cancel lonelypupsemail')
    });
    ctx.scene.resume();
});
exports.setLonelypupsEmail.wait().hears(/(^\d+\.\d\d)|(^\d+)/g, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id);
    const userPrice = parseFloat(ctx.match[0]);
    ctx.session.tgId = parseFloat(ctx.match[0]);
    const lonelyEmail = new lonelypups_1.Lonelypups();
    lonelyEmail.email = ctx.session.text;
    lonelyEmail.deliveryPrice = ctx.session.tgId;
    lonelyEmail.author = String(ctx.from.id);
    await database_1.lonelypupsRepository.save(lonelyEmail);
    ctx.scene.exit();
    return (0, userEmails_1.privateLonelyPupsUserForNewMessage)(ctx);
});
async function deleteAllMessages(array, ctx) {
    for (const id of array) {
        try {
            await ctx.api.deleteMessage(ctx.chat.id, id).catch();
        }
        catch (e) {
            console.log(e);
        }
    }
}
