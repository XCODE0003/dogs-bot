"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const getUsername_1 = require("../../../helpers/getUsername");
const user_1 = require("../../../database/models/user");
const moment_1 = __importDefault(require("moment"));
const regex = /admin vbiver list/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const vbivers = await database_1.userRepository.find({ where: { role: user_1.UserRole.VBIVER } });
    for (const vbiver of vbivers) {
        let text = `🐨 Вбивер: ${await (0, getUsername_1.getUsername)(vbiver, true)}`;
        text += `\n⌚️ На вбиве с: <code>${(0, moment_1.default)(new Date(vbiver.vbivDate)).format('DD.MM.YYYY в hh:mm')}</code>`;
        let keyb = [
            [{ text: 'Подробнее', callback_data: `/admin vbiver ${vbiver.tgId}` }]
        ];
        if (vbiver === vbivers[vbivers.length - 1]) {
            keyb.push([{ text: "Админ панель", callback_data: `adminMenuWithPicture` }]);
        }
        await ctx.reply(text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: keyb
            }
        });
        await new Promise(res => setTimeout(res, 1000 * 0.35));
    }
}
