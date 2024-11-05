"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getUsername_1 = require("../../../helpers/getUsername");
const menu_1 = require("../../../handlers/admins/supports/menu");
const regex = /admin supports list (?<status>on|off)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    ctx.deleteMessage().then();
    const match = regex.exec(ctx.callbackQuery.data);
    const status = (match.groups.status === "on");
    const supports = await database_1.supportsRepository.find({ relations: { user: true } });
    for (const support of supports) {
        if (support.active === status) {
            let text = `🐨 ТПшер: ${await (0, getUsername_1.getUsername)(support.user)} || ${support.percent}%`;
            text += `\n🌳 Активный: ${(support.active) ? 'Да' : 'Нет'}`;
            text += `\n\n<code>/admin support ${support.user.tgId}</code>`;
            await ctx.reply(text, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Подробнее', callback_data: `/admin support ${support.user.tgId}` }]
                    ]
                }
            });
            await new Promise(res => setTimeout(res, 1000 * 0.35));
        }
    }
    return (0, menu_1.supportsMenu)(ctx);
}
