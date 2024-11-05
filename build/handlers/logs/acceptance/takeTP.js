"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const regex = /^ad support set (?<order>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, callbackHandler);
async function callbackHandler(ctx) {
    const match = regex.exec(ctx.match[0]);
    const ad = await database_1.adsRepository.findOne({
        where: {
            id: Number(match.groups.order)
        },
        relations: ["support"]
    });
    if (ad.support && Number(ad?.support?.tgId) === ctx.from.id) {
        return ctx.answerCallbackQuery({
            text: '🙈 Нельзя забирать логи у самого ж себя!',
            show_alert: true
        });
    }
    try {
        await ctx.editMessageReplyMarkup({
            reply_markup: {
                inline_keyboard: [
                    [{ text: `${ctx.from.first_name}`, url: "tg://user?id=" + ctx.from.id }],
                    [{ text: `Забрать`, callback_data: `ad support set ${match.groups.order}` }]
                ]
            }
        });
    }
    catch (e) { }
    if (!ad)
        return ctx.deleteMessage();
    ad.support = ctx.user;
    return await database_1.adsRepository.save(ad);
}
