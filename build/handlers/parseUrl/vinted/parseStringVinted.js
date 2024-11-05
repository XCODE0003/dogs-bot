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
exports.parseStringVinted = void 0;
const logger_1 = require("../../../utils/logger");
const fs = __importStar(require("fs"));
const console_1 = __importDefault(require("console"));
var tunnel = require('tunnel');
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const cheerio = require('cheerio');
const { firefox } = require('playwright');
const parseStringVinted = async (url, ctx) => {
    const browser = await firefox.launch({
        args: ['--disable-dev-shm-usage', '--no-sandbox'],
    });
    try {
        // options.addArguments('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        let body = '';
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto(url);
            body = await page.content();
            fs.writeFileSync('test.html', body);
        }
        catch (e) {
            await ctx.reply(`Ошибка драйвера: ${e.toString()}`);
            return undefined;
        }
        finally {
            await browser.close();
        }
        await fs.writeFileSync('page.html', body);
        const $ = cheerio.load(body);
        $('#onetrust-consent-sdk').remove();
        $('.ReactModal__Overlay').remove();
        body = $.html();
        if (!body)
            throw new SyntaxError("await parse.text() -- Данные некорректны\n\n " + body);
        const data = await getInfo(body);
        if (data === undefined)
            throw new SyntaxError("Некорректная работа регулярного выражения \n\n" + data);
        let imgHref = await getImgHref($);
        if (!imgHref)
            imgHref = '0';
        $('script').remove();
        body = $.html();
        return {
            imgHref,
            detail: data,
            page: body.replaceAll(/<script>.+<\/script>/gmsi, 'asdasdasd'),
            pageMobile: ''
        };
    }
    catch (e) {
        logger_1.log.warn(e);
        console_1.default.log(e);
        ctx.reply("Ошибка парсинга");
        return undefined;
    }
};
exports.parseStringVinted = parseStringVinted;
const getInfo = async (body) => {
    const titleRegex = /<meta property="og:title" content="(?<title>.*?)"/gmsi.exec(body);
    const descriptionRegex = /<meta property="og:description" content="(?<description>.*?)"/gmsi.exec(body);
    const $ = cheerio.load(body);
    const itemPriceElement = $('div.u-flexbox.u-justify-content-between[data-testid="item-price"]');
    console_1.default.log(itemPriceElement);
    let price = itemPriceElement.text();
    console_1.default.log(price);
    price = price.replace('€', '');
    console_1.default.log(price);
    if (!titleRegex?.groups?.title
        || !descriptionRegex?.groups?.description)
        return undefined;
    return {
        title: titleRegex.groups?.title,
        description: descriptionRegex?.groups?.description,
        price: '0.00',
        totalPrice: '0.00'
    };
};
const getImgHref = async ($) => {
    try {
        return await $('.item-photo--1 > a').attr('href');
    }
    catch (e) {
        return undefined;
    }
};
