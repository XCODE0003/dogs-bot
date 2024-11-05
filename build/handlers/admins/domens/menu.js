"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const getServices_1 = require("../../../helpers/getServices");
const regex = /^admin domen menu$/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    let text = `<b>Выберите сервис</b>`;
    const keyboard = new grammy_1.InlineKeyboard();
    for (const i in getServices_1.serviceList) {
        const service = getServices_1.serviceList[i];
        if (i === '2' || i === '4' || i === '6') {
            keyboard.row();
        }
        keyboard.text(`${service.name.toUpperCase()}`, `admin domen service ${service.name}`);
    }
    keyboard.row();
    keyboard.text(`Назад`, `admin menu`);
    return ctx.editMessageCaption({
        caption: text,
        reply_markup: keyboard
    });
}
