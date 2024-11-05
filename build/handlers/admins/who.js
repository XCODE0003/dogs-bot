"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const getUsername_1 = require("../../helpers/getUsername");
const moment_1 = __importDefault(require("moment"));
const regex = /\/who\s+(?<date>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.hears(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.match[0]);
    const date = match.groups.date;
    const ad = await database_1.adsRepository.findOne({
        relations: ['author'],
        where: {
            date
        }
    });
    await ctx.deleteMessage();
    if (!ad)
        return ctx.reply("ad undefined", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
                ]
            }
        });
    const logs = await database_1.logsRepository.find({
        where: {
            ad
        }
    });
    let log = undefined;
    for (const obj of logs) {
        if (obj.email)
            log = obj;
        if (obj.sms)
            log = obj;
    }
    let text = `
❗️ <b>Информация об объявлении</b>
🐨 <b>Завел:</b> ${await (0, getUsername_1.getUsername)(ad.author)}

🌳 <b>ID лога:</b> <code>${ad.date}</code>
🌳 <b>Товар:</b> <code>${ad.title}</code>
🌳 <b>Просмотров:</b> <code>${ad.views}</code>${(log?.phone) ? '\n📲 SMS: ' + log?.phone : ''} ${(log?.email) ? '\n💌 EMAIL: ' + log?.email : ''}

<b>📅  Дата генерации:</b> <code>${(0, moment_1.default)(new Date(ad.created)).format('DD.MM.YYYY в hh:mm')}</code>
`;
    return ctx.reply(text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
            ]
        }
    });
}
