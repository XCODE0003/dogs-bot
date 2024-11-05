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
exports.parseStringWallapop = void 0;
const logger_1 = require("../../../utils/logger");
const fs = __importStar(require("fs"));
const console_1 = __importDefault(require("console"));
var tunnel = require('tunnel');
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const cheerio = require('cheerio');
const parseStringWallapop = async (url, ctx) => {
    const chrome = require('selenium-webdriver/chrome');
    const options = new chrome.Options();
    try {
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--no-sandbox');
        // options.addArguments('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        let body = '';
        let driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        try {
            await driver.get(url);
            body = await driver.getPageSource();
        }
        catch (e) {
            await ctx.reply(`Ошибка драйвера: ${e.toString()}`);
            return undefined;
        }
        finally {
            await driver.quit();
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
exports.parseStringWallapop = parseStringWallapop;
const getInfo = async (body) => {
    let title = undefined;
    let description = undefined;
    let price = undefined;
    let img = undefined;
    const $ = cheerio.load(body);
    const scriptElement = $('script#__NEXT_DATA__');
    let dataInPage = undefined;
    try {
        dataInPage = JSON.parse(scriptElement.text());
    }
    catch (e) {
        return undefined;
    }
    title = dataInPage?.props?.pageProps?.item?.title?.original;
    description = dataInPage?.props?.pageProps?.item?.description?.original;
    price = dataInPage?.props?.pageProps?.item?.price?.cash?.amount;
    img = dataInPage?.props?.pageProps?.item?.images?.[0]?.urls?.big;
    if (!title
        || !description
        || !price)
        return undefined;
    return {
        title: title,
        description: description,
        price: price,
        totalPrice: price,
        img: img
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
