"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateLonelyPupsUserForNewMessage = exports.privateLonelyPupsUserEmail = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getPictureMenu_1 = require("../../../helpers/getPictureMenu");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('private lonelypups user emails', privateLonelyPupsUserEmail);
async function privateLonelyPupsUserEmail(ctx) {
    const inline_keyboard = [];
    const emails = await database_1.lonelypupsRepository.find({
        where: {
            author: String(ctx.user.tgId)
        }
    });
    for (const email of emails) {
        inline_keyboard.push([{ text: email.email.slice(0, 18), callback_data: `private lonelypups emailInfo ${email.id}` }]);
    }
    inline_keyboard.push([{ text: "📩 Создать новую почту", callback_data: `private lonelypups set email` }]);
    inline_keyboard.push([{ text: "Назад", callback_data: `private menu lonelypups` }]);
    return ctx.editMessageCaption({
        reply_markup: {
            inline_keyboard
        }
    });
}
exports.privateLonelyPupsUserEmail = privateLonelyPupsUserEmail;
async function privateLonelyPupsUserForNewMessage(ctx) {
    const inline_keyboard = [];
    const emails = await database_1.lonelypupsRepository.find({
        where: {
            author: String(ctx.user.tgId)
        }
    });
    for (const email of emails) {
        inline_keyboard.push([{ text: email.email.slice(0, 18), callback_data: `private lonelypups emailInfo ${email.id}` }]);
    }
    inline_keyboard.push([{ text: "📩 Создать новую почту", callback_data: `private lonelypups set email` }]);
    inline_keyboard.push([{ text: "Назад", callback_data: `private menu lonelypups` }]);
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), {
        // caption: 'test',
        reply_markup: {
            inline_keyboard
        }
    });
}
exports.privateLonelyPupsUserForNewMessage = privateLonelyPupsUserForNewMessage;
