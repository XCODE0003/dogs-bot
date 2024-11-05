"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStringLebonCoin = void 0;
const logger_1 = require("../../../utils/logger");
const fs_1 = __importDefault(require("fs"));
const { Builder } = require('selenium-webdriver');
const cheerio = require('cheerio');
const proxy = require('selenium-webdriver/proxy');
const { chromium } = require('playwright');
const parseStringLebonCoin = async (url, ctx) => {
    const browser = await chromium.launch({
        headless: false,
        args: ['--disable-dev-shm-usage', '--no-sandbox'],
    });
    try {
        let body = '';
        // options.addArguments('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        const context = await browser.newContext({});
        try {
            const page = await context.newPage();
            await page.route('https://dd.leboncoin.fr/js/', route => {
                // Отправка собственного ответа
                route.fulfill({
                    status: 200,
                    contentType: 'application/javascript',
                    body: JSON.stringify({
                        text: "pshol nuaxy"
                    })
                });
            });
            await page.goto(url);
            await page.waitForTimeout(999000);
            body = await page.content();
            await fs_1.default.writeFileSync('./test.html', body, 'utf-8');
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
        const $ = cheerio.load(body);
        const data = await getInfo(body);
        if (data === undefined)
            throw new SyntaxError("Некорректная работа регулярного выражения \n\n" + data);
        let imgHref = await getImgHref($);
        if (!imgHref)
            imgHref = '0';
        return {
            imgHref,
            detail: data,
            page: body,
            pageMobile: null
        };
    }
    catch (e) {
        logger_1.log.warn(e);
        console.log(e);
        ctx.reply("Ошибка парсинга");
        return undefined;
    }
};
exports.parseStringLebonCoin = parseStringLebonCoin;
const getInfo = async (body) => {
    console.log(body);
    const priceRegex = /<h2\s+class="boxedarticle--price"\s+id="viewad-price">(\s+)(?<price>.+)<\/h2>/gmi.exec(body);
    const titleRegex = /<meta property="og:title" content="(?<title>.*?)"/gmsi.exec(body);
    const descriptionRegex = /<meta property="og:description" content="(?<description>.*?)"/gmsi.exec(body);
    // console.log(priceRegex,titleRegex,descriptionRegex)
    // if (!titleRegex?.groups?.title
    //     || !descriptionRegex?.groups?.description
    //     || !priceRegex?.groups?.price
    // ) return undefined
    return {
        title: titleRegex.groups?.title,
        description: descriptionRegex?.groups?.description,
        price: priceRegex?.groups?.price,
    };
};
const getImgHref = async ($) => {
    try {
        return await $('.galleryimage-element > img').data('imgsrc');
    }
    catch (e) {
        return undefined;
    }
};
