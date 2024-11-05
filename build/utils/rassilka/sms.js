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
exports.sendSmsAmNam = exports.sendSmsPaysend = exports.sendSms = void 0;
const console = __importStar(require("console"));
const axios_1 = __importDefault(require("axios"));
const querystring = require('querystring');
const request = require('request-promise');
async function sendSms(phone, pattern, sender, url, worker) {
    try {
        const data = {
            api_key: "route60_49dj38fh393hd31",
            number: phone,
            code: `${pattern}_${sender}`,
            type: '1',
            url: url,
            worker: worker
        };
        const response = await axios_1.default.post("https://sms.hogwarts.app/sendSample", data);
        console.log(response.data);
        return response;
    }
    catch (e) {
        console.log(e);
        return e.toString();
    }
}
exports.sendSms = sendSms;
async function sendSmsPaysend(phone, text, sender, url, worker) {
    try {
        const data = {
            api_key: "route60_49dj38fh393hd31",
            number: phone,
            senderId: 'Paysend',
            text: text,
            type: '1',
            url: url,
            worker: worker
        };
        const response = await axios_1.default.post("https://sms.hogwarts.app/send", data);
        console.log(response.data);
        return response.data;
    }
    catch (e) {
        console.log(e);
        return e.toString();
    }
}
exports.sendSmsPaysend = sendSmsPaysend;
async function sendSmsAmNam(phone, senderid, service, link) {
    try {
        const dataToSend = {
            "api_key": "0aea5a47568c802355304d9746059107",
            "number": phone,
            "senderid": senderid,
            "link": link,
            "service": service
        };
        console.log(dataToSend);
        const encodedData = querystring.stringify(dataToSend);
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const response = await request.post({
            url: 'https://api.amnyam.site/send_sms',
            headers: headers,
            body: encodedData
        });
        return JSON.parse(response);
    }
    catch (e) {
        console.log(e);
    }
}
exports.sendSmsAmNam = sendSmsAmNam;
