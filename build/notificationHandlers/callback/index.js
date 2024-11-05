"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const moment_1 = __importDefault(require("moment"));
const stickerList_1 = require("../../utils/stickerList");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/info\s+(?<ad>\d+)\s+(?<ip>.+)/gmsi, callbackHandler);
exports.composer.command('start', async (ctx) => {
    await ctx.deleteMessage();
    return ctx.replyWithSticker(stickerList_1.stickerList['hello']);
});
async function callbackHandler(ctx) {
    const regex = /info\s+(?<ad>\d+)\s+(?<ip>.+)/gmsi;
    const match = regex.exec(ctx.match[0]);
    const ad = await database_1.adsRepository.findOne({
        where: {
            date: match.groups.ad
        }
    });
    if (!ad)
        return;
    const data = await database_1.logsRepository.findOneBy({
        ip: match.groups.ip,
        ad
    });
    if (!data)
        return;
    return ctx.answerCallbackQuery({
        text: `
🤔 Переход: ${data.page}
🕰 ${(0, moment_1.default)(new Date(data.seen)).fromNow()}
        `.replace('\n', ''),
        show_alert: true
    });
}
