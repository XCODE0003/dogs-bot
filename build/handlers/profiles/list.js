"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const getServices_1 = require("../../helpers/getServices");
const getFlagEmoji_1 = require("../../helpers/getFlagEmoji");
const getCountryByCountryCode_1 = require("../../helpers/getCountryByCountryCode");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
const regexService = /^profiles list (?<service>.+)$/gmi;
const regexCountry = /^profiles list (?<service>.+) (?<country>.+)$/gmi;
exports.composer.callbackQuery(/^profiles list$/gmi, service);
exports.composer.callbackQuery(regexCountry, list);
exports.composer.callbackQuery(regexService, serviceCountry);
async function service(ctx) {
    const keyboard = new grammy_1.InlineKeyboard();
    for (const i in getServices_1.serviceList) {
        const service = getServices_1.serviceList[i];
        if (service.profile) {
            if (i === '2' || i === '4' || i === '6') {
                keyboard.row();
            }
            keyboard.text(service.name.toUpperCase(), `profiles list ${service.name}`);
        }
    }
    keyboard.row();
    keyboard.text('Назад', `profiles menu`);
    return ctx.editMessageCaption({
        caption: '<b>Выбери платформу:</b>',
        reply_markup: keyboard
    });
}
async function serviceCountry(ctx) {
    const match = regexService.exec(ctx.callbackQuery.data);
    const service = (0, getServices_1.getService)(match.groups.service);
    const keyboard = new grammy_1.InlineKeyboard();
    for (const i in service.country) {
        const countryCode = service.country[i];
        if (i === '2' || i === '4' || i === '6') {
            keyboard.row();
        }
        keyboard.text(`${(0, getFlagEmoji_1.getFlagEmoji)(countryCode)} ${(0, getCountryByCountryCode_1.getCountryByCountryCode)(countryCode)}`, `profiles list ${service.name} ${countryCode}`);
    }
    keyboard.row();
    keyboard.text(`Назад`, `profiles list`);
    return ctx.editMessageCaption({
        caption: '<b>Выбери страну:</b>',
        reply_markup: keyboard
    });
}
async function list(ctx) {
    const match = regexCountry.exec(ctx.callbackQuery.data);
    const service = (0, getServices_1.getService)(match.groups.service);
    const country = match.groups.country;
    const keyboard = new grammy_1.InlineKeyboard();
    const profiles = await database_1.profilesRepository.find({
        relations: { user: true },
        where: {
            service: service.name,
            country: country,
            user: {
                tgId: ctx.user.tgId
            }
        }
    });
    if (profiles.length === 0) {
        return ctx.reply(`
<b>${(0, getFlagEmoji_1.getFlagEmoji)(country)} ${service.name.toUpperCase()}</b>
Тут у тебя нет профилей`, {
            reply_markup: {
                inline_keyboard: [
                    // [{text: 'Создать', callback_data: 'adasdasd'}],
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
    }
    profiles.slice(0, 9);
    for (const i in profiles) {
        const profile = profiles[i];
        if (i === '3' || i === '6' || i === '9') {
            keyboard.row();
        }
        keyboard.text(`${(profile.fullName.length > 9) ? profile.fullName.slice(0, 9) + '...' : profile.fullName}`, `profiles info ${profile.id}`);
    }
    keyboard.row();
    keyboard.text(`Закрыть`, `deleteThisMessage`);
    return ctx.reply(`<b>${(0, getFlagEmoji_1.getFlagEmoji)(country)} ${service.name.toUpperCase()}</b>`, {
        reply_markup: keyboard
    });
}
