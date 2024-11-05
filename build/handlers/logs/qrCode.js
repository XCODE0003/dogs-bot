"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setQrCodeInLogScene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const download_1 = require("../../utils/download");
const redirect_1 = require("../../handlers/logs/redirect");
const getUsername_1 = require("../../helpers/getUsername");
exports.composer = new grammy_1.Composer();
const regex = /log\s+set\s+qrcode\s+(?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    await ctx.scenes.enter('log-set-qrcode');
}
exports.setQrCodeInLogScene = new grammy_scenes_1.Scene('log-set-qrcode');
async function cancel(ctx) {
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.setQrCodeInLogScene.always().callbackQuery('cancel log-set-qrcode', cancel);
exports.setQrCodeInLogScene.always().callbackQuery(/qrcode redirect/, async (ctx) => {
    const regex = /log\s+redirect\s+(?<type>.+)\s+(?<order>\d+)\s+(?<msgDelete>true|false)/gmsi;
    ctx.match = regex.exec(`log redirect qrcode ${ctx.session.logId} false`);
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    await (0, redirect_1.redirectMamont)(ctx);
    ctx.scene.exit();
});
exports.setQrCodeInLogScene.do(async (ctx) => {
    const match = regex.exec(ctx.match[0]);
    const id = match.groups.id;
    const log = await database_1.logsRepository.findOne({
        relations: ['ad', 'ad.author', 'ad.acceptedLog'],
        where: {
            id: Number(id)
        }
    });
    if (!log) {
        await ctx.reply('Лог не найден', {
            reply_markup: new grammy_1.InlineKeyboard()
                .text('Закрыть', 'deleteThisMessage')
        });
        // @ts-ignore
        return ctx.scene.exit();
    }
    if (log.ad.acceptedLog.tgId !== ctx.user.tgId) {
        await ctx.reply(`
    Каким то образом лог оказался в ${await (0, getUsername_1.getUsername)(log.ad.acceptedLog)}, как? Да хуй его знает, походу спиздил у тебя
    `, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        // @ts-ignore
        return ctx.scene.exit();
    }
    let res = undefined;
    if (log.qrCode) {
        const photo = await (0, download_1.getPhoto)(log.qrCode);
        res = await ctx.replyWithPhoto(new grammy_1.InputFile(photo), {
            caption: `${(log.qrCodeText) ? log.qrCodeText : ''}\n\n\n<b>🎆 Отправь QR-CODE и текст:</b>`,
            reply_markup: new grammy_1.InlineKeyboard()
                .text('Оставить текущее', `qrcode redirect`)
                .text('Отмена', 'cancel log-set-qrcode')
        });
    }
    else {
        res = await ctx.reply(`${(log.qrCodeText) ? log.qrCodeText : ''}\n\n\n<b>🎆 Отправь QR-CODE и текст:</b>`, {
            reply_markup: new grammy_1.InlineKeyboard()
                .text('Отмена', 'cancel log-set-qrcode')
        });
    }
    ctx.session.deleteMessage = [res.message_id];
    ctx.session.logId = Number(id);
});
exports.setQrCodeInLogScene.wait().on("message:photo", async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id);
    const res = await ctx.getFile();
    if (!res || !ctx.session.logId) {
        await ctx.reply('Не найдено фото / id лога', {
            reply_markup: new grammy_1.InlineKeyboard()
                .text('Закрыть', 'deleteThisMessage')
        });
        return ctx.scene.exit();
    }
    if (!ctx.msg.caption) {
        await ctx.reply('Не найден текст', {
            reply_markup: new grammy_1.InlineKeyboard()
                .text('Закрыть', 'deleteThisMessage')
        });
        return cancel(ctx);
    }
    const log = await database_1.logsRepository.findOne({
        where: {
            id: ctx.session.logId
        }
    });
    if (!log) {
        await ctx.reply('Лог не найден в бд', {
            reply_markup: new grammy_1.InlineKeyboard()
                .text('Закрыть', 'deleteThisMessage')
        });
        return cancel(ctx);
    }
    log.qrCode = res.file_path;
    log.qrCodeText = ctx.msg.caption;
    await database_1.logsRepository.save(log);
    const photo = await (0, download_1.getPhoto)(log.qrCode);
    const reply = await ctx.replyWithPhoto(new grammy_1.InputFile(photo), {
        caption: `<b>${log.qrCodeText}</b>`,
        reply_markup: new grammy_1.InlineKeyboard()
            .text('Редирект', `qrcode redirect`)
            .text('Отмена', 'cancel log-set-qrcode')
    });
    ctx.session.deleteMessage.push(reply.message_id);
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
