import fetch from "node-fetch";
import {log} from "@/utils/logger";
import {Context} from "@/database/models/context";
import * as fs from "fs";
import console from "console";
import * as process from "process";
var tunnel = require('tunnel');
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const cheerio = require('cheerio');

interface RegexData {
    title?: string,
    description?: string,
    price?: number | string,
    totalPrice?: number | string,
    img?: string
}

interface ParseString{
    imgHref: string,
    page: string,
    pageMobile: string,
    detail: RegexData
}

export const parseStringWallapop = async (url: string, ctx: Context): Promise<ParseString | string | undefined> => {
    const chrome = require('selenium-webdriver/chrome')
    const options = new chrome.Options()

    try {
        options.addArguments('--disable-dev-shm-usage')
        options.addArguments('--no-sandbox')
        // options.addArguments('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')

        let body = ''

        let driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build()
        try {

            await driver.get(url);
            body = await driver.getPageSource()

        } catch (e) {
            await ctx.reply(`Ошибка драйвера: ${e.toString()}`)
            return undefined
        } finally {
            await driver.quit();
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
    let title = undefined
    let description = undefined
    let price = undefined
    let img = undefined

    const $ = cheerio.load(body)
    const scriptElement = $('script#__NEXT_DATA__');

    let dataInPage = undefined
    try {
        dataInPage = JSON.parse(scriptElement.text())
    } catch (e) {
        return undefined
    }

    title = dataInPage?.props?.pageProps?.item?.title?.original
    description = dataInPage?.props?.pageProps?.item?.description?.original
    price = dataInPage?.props?.pageProps?.item?.price?.cash?.amount
    img = dataInPage?.props?.pageProps?.item?.images?.[0]?.urls?.big

    if (!title
        || !description
        || !price
    ) return undefined

    return {
        title: title,
        description: description,
        price: price,
        totalPrice: price,
        img: img
    }
}

const getImgHref = async ($: typeof cheerio) => {
    try {
        return await $('.item-photo--1 > a').attr('href')
    } catch (e) {
        return undefined
    }
}