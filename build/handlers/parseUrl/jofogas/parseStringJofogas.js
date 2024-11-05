"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStringJofogas = void 0;
const logger_1 = require("../../../utils/logger");
const { Builder } = require('selenium-webdriver');
const cheerio = require('cheerio');
const { chromium } = require('playwright');
const parseStringJofogas = async (url, ctx) => {
    const browser = await chromium.launch({
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
        let mobile = undefined;
        const browser2 = await chromium.launch({
            args: ['--disable-dev-shm-usage', '--no-sandbox'],
        });
        const context2 = await browser2.newContext({
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1',
        });
        try {
            const page = await context2.newPage();
            await page.goto(url);
            mobile = await page.content();
        }
        catch (e) {
            await ctx.reply(`Ошибка драйвера: ${e.toString()}`);
            return undefined;
        }
        finally {
            await browser2.close();
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
            pageMobile: mobile
        };
    }
    catch (e) {
        logger_1.log.warn(e);
        console.log(e);
        ctx.reply("Ошибка парсинга");
        return undefined;
    }
};
exports.parseStringJofogas = parseStringJofogas;
const getInfo = async (body) => {
    const priceRegex = /	price:\s+'(?<price>.+)'/gm.exec(body);
    const titleRegex = /	subject:\s+'(?<title>.+)'/gm.exec(body);
    const descriptionRegex = "none";
    if (!titleRegex?.groups?.title
        || !descriptionRegex
        || !priceRegex?.groups?.price)
        return undefined;
    return {
        title: titleRegex.groups?.title,
        description: descriptionRegex,
        price: priceRegex?.groups?.price + ' Ft',
    };
};
const getImgHref = async ($) => {
    try {
        return "none";
        return await $('.galleryimage-element > img').data('imgsrc');
    }
    catch (e) {
        return undefined;
    }
};
