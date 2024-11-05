"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const getUsername_1 = require("../../helpers/getUsername");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
const regex = /^\/me/gmi;
exports.composer.hears(regex, handler);
async function handler(ctx) {
    ctx.deleteMessage();
    const profits = await database_1.profitRepository.find({
        relations: { worker: true },
        where: {
            worker: {
                tgId: ctx.user.tgId
            }
        }
    });
    let amount = 0;
    for (const profit of profits) {
        amount += profit.workerValue;
    }
    let text = `🧸 ${await (0, getUsername_1.getUsername)(ctx.user)}`;
    text += `\n\n<b>🏷 Заработано: ${amount} USD</b>`;
    return ctx.reply(text);
}
