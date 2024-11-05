"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDomensKT = exports.checkKThandeler = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const console_1 = __importDefault(require("console"));
const config_1 = require("../../utils/config");
const request = require('request-promise');
exports.composer = new grammy_1.Composer();
const regex = /^\/domens/gmi;
exports.composer.hears(regex, (ctx) => checkKThandeler(ctx));
async function checkKThandeler(ctx, bot = undefined) {
    try {
        if (ctx) {
            await ctx.deleteMessage();
        }
    }
    catch (e) { }
    const normDomens = await database_1.domensRepository.findOne({
        where: {
            active: true,
            service: 'ebay'
        }
    });
    const proDomen = await database_1.proDomensRepository.findOne({
        where: {
            active: true,
            service: 'ebay'
        }
    });
    if (!proDomen || !normDomens)
        return null;
    const match = await checkDomensKT([normDomens.link, proDomen.link]);
    let text = ``;
    console_1.default.log(match);
    let main = false;
    let pro = false;
    if (match) {
        for (const obj of match) {
            if (obj?.threat?.url === normDomens.link && !main) {
                text += `\n❌❌[Обычный] AHTUNG ДОМЕН КТ ❌❌`;
                main = true;
            }
            if (obj?.threat?.url === proDomen.link && !pro) {
                text += `\n❌❌[PRO] AHTUNG ДОМЕН КТ ❌❌`;
                pro = true;
            }
        }
    }
    if (text) {
        text += `\n\nЗовем кодера @im_yupii !!!`;
    }
    else {
        text = "🍀 Все домены прошли проверку на КТ!";
    }
    if (bot && text !== "🍀 Все домены прошли проверку на КТ!") {
        const setting = await database_1.settingsRepository.findOne({
            where: {
                id: 1
            }
        });
        if (setting.work) {
            await bot.api.sendMessage(config_1.config.chats.chat, text);
            return bot.api.sendMessage(config_1.config.chats.proChat, text);
        }
    }
    if (ctx) {
        return ctx.reply(text);
    }
}
exports.checkKThandeler = checkKThandeler;
async function checkDomensKT(domens) {
    const recounstructDomens = [];
    for (const obj of domens) {
        recounstructDomens.push({
            url: obj
        });
    }
    try {
        const response = await request.post('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyAzARToy53Z35WcB-dgiZB_FqtvAFTbfF4', {
            json: true,
            headers: {
                "Content-type": "application/json"
            },
            body: {
                "client": {
                    "clientId": "test",
                    "clientVersion": "1.5.2"
                },
                "threatInfo": {
                    "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
                    "platformTypes": ["WINDOWS"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": recounstructDomens
                }
            },
        });
        if (response?.matches)
            return response?.matches;
        console_1.default.log(response);
    }
    catch (e) {
        console_1.default.log(e);
    }
}
exports.checkDomensKT = checkDomensKT;
