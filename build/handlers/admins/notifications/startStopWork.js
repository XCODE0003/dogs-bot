"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const config_1 = require("../../../utils/config");
const stickerList_1 = require("../../../utils/stickerList");
const user_1 = require("../../../database/models/user");
const regex = /admin work (?<status>start|stop)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const status = match.groups.status;
    const messageIds = [];
    const settings = await database_1.settingsRepository.findOne({ where: { id: 1 } });
    const users = await database_1.userRepository.find();
    const response = await ctx.reply(`Начинаю рассылку...`);
    messageIds.push(response.message_id);
    const result = {
        yep: 0,
        nope: []
    };
    settings.work = status === 'start';
    await database_1.settingsRepository.save(settings);
    const reply_markup = {
        inline_keyboard: [
            [{ text: "Меню", callback_data: "menuWithPicture" }]
        ]
    };
    await ctx.api.sendSticker(config_1.config.chats.chat, (status === 'start') ? stickerList_1.stickerList.fullBattery : stickerList_1.stickerList.lowBattery);
    await ctx.api.sendMessage(config_1.config.chats.chat, `${(status === 'start') ? '💚 FULL WORK' : '🛑 STOP WORK'}`);
    for (const user of users) {
        try {
            if (user.role === user_1.UserRole.VBIVER || user.role === user_1.UserRole.WORKER) {
                await ctx.api.sendSticker(user.tgId, (status === 'start') ? stickerList_1.stickerList.fullBattery : stickerList_1.stickerList.lowBattery);
                await ctx.api.sendMessage(user.tgId, `${(status === 'start') ? '💚 FULL WORK' : '🛑 STOP WORK'}`, { reply_markup });
                result.yep++;
            }
        }
        catch (e) {
            console.log(e);
            result.nope.push({ id: user.tgId, text: e.toString() });
        }
        await new Promise(res => setTimeout(res, 1000 * 0.35));
    }
    let text = 'INFO';
    for (const one of result.nope) {
        text += `\n\nid: ${one.id}\nproblem: ${one.text}`;
    }
    await (0, deleteAllMessages_1.deleteAllMessages)(messageIds, ctx);
    return ctx.replyWithDocument(new grammy_1.InputFile(Buffer.from(text, 'utf-8'), 'result.txt'), {
        caption: `Отправлено юзерам: ${result.yep}\n${result.nope.length} с ошибкой (чек файл)`,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
