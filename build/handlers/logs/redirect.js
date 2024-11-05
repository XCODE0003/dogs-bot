"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectMamont = exports.composer = void 0;
const grammy_1 = require("grammy");
const lonelypups_1 = require("../../database/lonelypups");
const regex = /log\s+redirect\s+(?<type>.+)\s+(?<order>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, redirectMamont);
async function redirectMamont(ctx) {
    const match = regex.exec(ctx.match[0]);
    const log = await lonelypups_1.lonelyRepository.getOrder(Number(match.groups.order));
    if (match.groups.msgDelete === 'true') {
        await ctx.api.deleteMessage(ctx.callbackQuery.from.id, ctx.callbackQuery.message.message_id);
    }
    if (match.groups.type === "push")
        await lonelypups_1.lonelyRepository.setOrder(Number(match.groups.order), {
            status: "push"
        });
    // if (match.groups.type === "error")
    //     await lonelyRepository.setOrder(Number(match.groups.order), {
    //         status: "wait",
    //         error: 'text'
    //     })
    if (match.groups.type === "push-code")
        await lonelypups_1.lonelyRepository.setOrder(Number(match.groups.order), {
            status: "code"
        });
    await ctx.reply(`
#ID_${log.id}
    
👍 Запрос на редирект "${match.groups.type}" успешно отправлен
`, {
        reply_to_message_id: ctx.callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                [{ text: "Закрыть", callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
exports.redirectMamont = redirectMamont;
