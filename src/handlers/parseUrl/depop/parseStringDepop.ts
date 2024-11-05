
import fetch from "node-fetch";
import {log} from "@/utils/logger";
import {Context} from "@/database/models/context";
import * as fs from "fs";
const cheerio = require('cheerio');

import * as path from "path";
import {DepopJson, Picture, Seller} from "@/handlers/parseUrl/depop/type";
import * as console from "console";
let {webdriver, Builder} = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
let chromePath = require('chromedriver').path;


const cookies = [
    {
        "domain": ".depop.com",
        "httpOnly": false,
        "name": "language",
        "path": "/",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "de",
        "id": 6
    },
    {
        "domain": ".depop.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "location",
        "path": "/",
        "secure": false,
        "session": true,
        "storeId": "0",
        "value": "de",
        "id": 7
    },
    {
        "domain": ".depop.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "NEXT_LOCALE",
        "path": "/",
        "secure": false,
        "session": true,
        "storeId": "0",
        "value": "de",
        "id": 8
    },
]

interface RegexData {
    title?: string,
    description?: string,
    price?: string,
    pictures?: Picture[][],
    seller?: Seller
}

interface ParseString{
    detail: RegexData
}

export const parseStringDepop = async (url: string, ctx: Context): Promise<ParseString | string | undefined> => {
    const chrome = require('selenium-webdriver/chrome')
    const options = new chrome.Options()

    try {
        options.addArguments('--disable-dev-shm-usage')
        options.addArguments('--no-sandbox')
        // options.addArguments('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        let body = ''
        //
        let driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build()
        try {

            await driver.get(url);

            for (const cookie of cookies) {
                await driver.manage().addCookie(cookie)
            }

            await driver.get(url);
            body = await driver.getPageSource()
            fs.writeFileSync('test.html', body)
        } catch (e) {
            await ctx.reply(`Ошибка драйвера: ${e.toString()}`)
            return undefined
        } finally {
            await driver.quit();
        }

        if (!body) throw new SyntaxError("await parse.text() -- Данные некорректны\n\n " + body);

        const $ = cheerio.load(body)

        const data = await getInfo(body)
        if (data === undefined) throw new SyntaxError("Некорректная работа регулярного выражения \n\n" + data)

        fs.writeFileSync('text.txt', body)
        return {
            detail: data
        }
    } catch (e) {
        log.warn(e)
        console.log(e)
        ctx.reply("Ошибка парсинга")
        return undefined
    }
}

const getInfo = async (body: string): Promise<RegexData | undefined> => {
    const regex = /<script id="__NEXT_DATA__" type="application\/json" nonce="">(?<json>{.+"defaultLocale":"us","scriptLoader":\[]})<\/script>/gm.exec(body);
    const regexTitle = /<title>(?<title>.*?)\| Depop<\/title>/.exec(body)

    const data: DepopJson = JSON.parse(regex?.groups?.json)
    if (!data || !regexTitle?.groups?.title) return undefined

    return {
        title: regexTitle?.groups?.title,
        description: data.props.initialReduxState.product.product.description,
        price: data.props.initialReduxState.product.product.price.priceAmount + ' €',
        pictures: data.props.initialReduxState.product.product.pictures,
        seller: data.props.initialReduxState.product.product.seller,
    }
}

const getImgHref = async ($: typeof cheerio) => {
    try {
        return await $('.item-photo--1 > a').attr('href')
    } catch (e) {
        return undefined
    }
}