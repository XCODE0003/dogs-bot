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
exports.parseStringFacebook = void 0;
const logger_1 = require("../../../utils/logger");
const console = __importStar(require("console"));
const fs_1 = __importDefault(require("fs"));
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const { chromium } = require('playwright');
const cookies = [
    {
        "domain": ".facebook.com",
        "expirationDate": 1711276121.132238,
        "hostOnly": false,
        "httpOnly": false,
        "name": "c_user",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "100091280071569",
        "id": 1
    },
    {
        "domain": ".facebook.com",
        "expirationDate": 1714299718.228812,
        "hostOnly": false,
        "httpOnly": true,
        "name": "datr",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "OcseZBEjUrfZT_E58qR8KDry",
        "id": 2
    },
    {
        "domain": ".facebook.com",
        "expirationDate": 1680344516,
        "hostOnly": false,
        "httpOnly": false,
        "name": "dpr",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "2",
        "id": 3
    },
    {
        "domain": ".facebook.com",
        "expirationDate": 1687516114.132264,
        "hostOnly": false,
        "httpOnly": true,
        "name": "fr",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "01ApMz8tO9Xo75Bz1.AWV9J7hasYEatYNecmw3TDFqe68.BkHss5.0c.AAA.0.0.BkHszZ.AWUWB0U5i3c",
        "id": 4
    },
    {
        "domain": ".facebook.com",
        "expirationDate": 1680344537.508298,
        "hostOnly": false,
        "httpOnly": false,
        "name": "locale",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "ru_RU",
        "id": 5
    },
    {
        "domain": ".facebook.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "presence",
        "path": "/",
        "sameSite": "Strict",
        "secure": true,
        "session": true,
        "storeId": "1",
        "value": "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1679740433677%2C%22v%22%3A1%7D",
        "id": 6
    },
    {
        "domain": ".facebook.com",
        "expirationDate": 1714300128.132203,
        "hostOnly": false,
        "httpOnly": true,
        "name": "sb",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "OcseZMMH6u5-OlnK3rm-7Ol6",
        "id": 7
    },
    {
        "domain": ".facebook.com",
        "expirationDate": 1680344931,
        "hostOnly": false,
        "httpOnly": false,
        "name": "wd",
        "path": "/",
        "sameSite": "Lax",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "1352x660",
        "id": 8
    },
    {
        "domain": ".facebook.com",
        "expirationDate": 1711276121.132249,
        "hostOnly": false,
        "httpOnly": true,
        "name": "xs",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "39%3AKrb4XWhrhWkiNA%3A2%3A1679740125%3A-1%3A-1",
        "id": 9
    }
];
const parseStringFacebook = async (url, ctx) => {
    const browser = await chromium.launch({
        headless: false,
        args: ['--disable-dev-shm-usage', '--no-sandbox'],
    });
    try {
        let body = '';
        // options.addArguments('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto(url);
            body = await page.content();
        }
        catch (e) {
            await ctx.reply(`Ошибка драйвера: ${e.toString()}`);
            return undefined;
        }
        finally {
            await browser.close();
        }
        if (!body)
            throw new SyntaxError("await parse.text() -- Данные некорректны\n\n " + body);
        const data = await getInfo(body);
        if (data === undefined)
            throw new SyntaxError("Некорректная работа регулярного выражения \n\n" + data);
        let imgHref = await getImgHref(body);
        if (!imgHref)
            imgHref = '0';
        return {
            imgHref,
            detail: data,
            page: body,
        };
    }
    catch (e) {
        logger_1.log.warn(e);
        console.log(e);
        ctx.reply("Ошибка парсинга");
        return undefined;
    }
};
exports.parseStringFacebook = parseStringFacebook;
const getInfo = async (body) => {
    const priceRegex = /asd/gmi.exec(body);
    // const priceRegex = /\]\,\"listing_price\"\:(?<json>\{.+?\})"/gmixs.exec(body);
    const titleRegex = /"meta":{"title":"(?<title>.*?)\\u2014/gmi.exec(body);
    const descriptionRegex = /"redacted_description":{"text":"(?<description>.*?)"/gmi.exec(body);
    // const json = JSON.parse(priceRegex.groups.json)
    // console.log(json)
    const price = 234;
    console.log(priceRegex);
    fs_1.default.writeFileSync('test.html', body);
    return null;
    if (!titleRegex?.groups?.title
        || !price)
        return undefined;
    try {
        // @ts-ignore
        titleRegex.groups.title = decodeURIComponent(JSON.parse('"' + titleRegex.groups.title.replace(/\"/g, '\\"') + '"'));
    }
    catch (e) { }
    try {
        // @ts-ignore
        descriptionRegex.groups.description = decodeURIComponent(JSON.parse('"' + descriptionRegex.groups.description.replace(/\"/g, '\\"') + '"'));
    }
    catch (e) { }
    return {
        title: titleRegex.groups?.title,
        description: descriptionRegex?.groups?.description,
        price: price + 'Ft',
    };
};
const getImgHref = async (body) => {
    try {
        return /listing_photos":\[{"__typename":"ProductImage","accessibility_caption":"No photo description available\.","image".*?uri":"(?<img>.*?)"/gmi
            .exec(body).groups.img;
    }
    catch (e) {
        return undefined;
    }
};
