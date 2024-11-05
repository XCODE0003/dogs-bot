"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const createVbiverMenu_1 = require("../../helpers/vbiver/createVbiverMenu");
const createVbiverText_1 = require("../../helpers/vbiver/createVbiverText");
const regex = /log info (?<id>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.update.callback_query.data);
    const id = match.groups.id;
    const log = await database_1.logsRepository.findOne({
        where: { id: Number(id) },
        relations: ["ad", "data", "ad.author", "ad.support", "ad.acceptedLog"]
    });
    if (!log)
        return;
    return ctx.editMessageText(await (0, createVbiverText_1.createVbiverText)(log), {
        reply_markup: await (0, createVbiverMenu_1.createVbiverMenu)(log.id)
    });
}
