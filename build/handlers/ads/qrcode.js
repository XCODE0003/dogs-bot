"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const qrcode_1 = __importDefault(require("qrcode"));
const fs = require('fs').promises;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/^qrcode get (?<id>\d+|paysend)/gmi, handler);
async function handler(ctx) {
    const match = /^qrcode get (?<id>\d+|paysend)/gmi.exec(ctx.callbackQuery.data);
    let ad = undefined;
    if (match.groups.id === 'paysend') {
        ad = "paysend";
    }
    else {
        ad = await database_1.adsRepository.findOne({
            relations: ['profile'],
            where: {
                id: Number(match.groups.id)
            }
        });
    }
    if (!ad)
        return ctx.reply('ad undefined');
    const domen = await database_1.domensRepository.findOne({
        where: {
            active: true,
            service: (ad === 'paysend') ? 'paysend' : ad.service
        }
    });
    if (!ad)
        return ctx.reply('domen undefined');
    try {
        let qrDataUrl = undefined;
        if (ad === 'paysend') {
            qrDataUrl = await qrcode_1.default.toDataURL(`https://${domen.link}/link/paysend/${ctx.user.id}`);
        }
        else {
            qrDataUrl = await qrcode_1.default.toDataURL(`https://${domen.link}/link/${ad.link}`);
        }
        const base64Data = qrDataUrl.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        try {
            await fs.access(`temp/qrcode_${ad.date}.png`);
            await ctx.replyWithPhoto(new grammy_1.InputFile(`temp/qrcode_${ad.date}.png`), {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Закрыть', callback_data: "deleteThisMessage" }]
                    ]
                }
            });
        }
        catch (error) {
            await ctx.reply("QR-CODE V2 undefined :(", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Закрыть', callback_data: "deleteThisMessage" }]
                    ]
                }
            });
        }
        return ctx.replyWithPhoto(new grammy_1.InputFile(imageBuffer), {
            caption: `⚠️ Если нет второго qr-code, подожди немного`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: "deleteThisMessage" }]
                ]
            }
        });
    }
    catch (err) {
        return ctx.reply('Не удалось создать qr-code', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: "deleteThisMessage" }]
                ]
            }
        });
    }
}
exports.handler = handler;
