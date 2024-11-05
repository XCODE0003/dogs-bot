import fetch from "node-fetch";
import {log} from "@/utils/logger";
import {Context} from "@/database/models/context";
import * as fs from "fs";
import console from "console";
import * as process from "process";
var tunnel = require('tunnel');
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const cheerio = require('cheerio');
const { firefox } = require('playwright');

interface RegexData {
    title?: string,
    description?: string,
    price?: number | string,
    totalPrice?: number | string
}

interface ParseString{
    imgHref: string,
    page: string,
    pageMobile: string,
    detail: RegexData
}

export const parseStringVinted = async (url: string, ctx: Context): Promise<ParseString | string | undefined> => {
    const browser = await firefox.launch({
        args: ['--disable-dev-shm-usage', '--no-sandbox'],
    });

    try {
        // options.addArguments('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')

        let body = ''
        const context = await browser.newContext();

        try {
            const page = await context.newPage();
            await page.goto(url);
            body = await page.content();
            fs.writeFileSync('test.html', body)
        } catch (e) {
            await ctx.reply(`Ошибка драйвера: ${e.toString()}`)
            return undefined
        } finally {
            await browser.close();
        }

        await fs.writeFileSync('page.html', body)

        const $ = cheerio.load(body)

        $('#onetrust-consent-sdk').remove();
        $('.ReactModal__Overlay').remove();

        body = $.html()
        if (!body) throw new SyntaxError("await parse.text() -- Данные некорректны\n\n " + body);

        const data = await getInfo(body)
        if (data === undefined) throw new SyntaxError("Некорректная работа регулярного выражения \n\n" + data)

        let imgHref = await getImgHref($)
        if (!imgHref)   imgHref = '0'

        $('script').remove();
        body = $.html()
        return {
            imgHref,
            detail: data,
            page: body.replaceAll(/<script>.+<\/script>/gmsi, 'asdasdasd'),
            pageMobile: ''
        }
    } catch (e) {
        log.warn(e)
        console.log(e)
        ctx.reply("Ошибка парсинга")
        return undefined
    }
}

const getInfo = async (body: string): Promise<RegexData | undefined> => {
    const titleRegex = /<meta property="og:title" content="(?<title>.*?)"/gmsi.exec(body);
    const descriptionRegex = /<meta property="og:description" content="(?<description>.*?)"/gmsi.exec(body);

    const $ = cheerio.load(body)
    const itemPriceElement = $('div.u-flexbox.u-justify-content-between[data-testid="item-price"]');
    console.log(itemPriceElement)

    let price = itemPriceElement.text();
    console.log(price)

    price = price.replace('€', '')

    console.log(price)
    if (!titleRegex?.groups?.title
        || !descriptionRegex?.groups?.description
    ) return undefined

    return {
        title: titleRegex.groups?.title,
        description: descriptionRegex?.groups?.description,
        price: '0.00',
        totalPrice: '0.00'
    }
}

const getImgHref = async ($: typeof cheerio) => {
    try {
        return await $('.item-photo--1 > a').attr('href')
    } catch (e) {
        return undefined
    }
}