import {log} from "@/utils/logger";
import {Context} from "@/database/models/context";
import fs from "fs";
import axios from "axios";
import {HttpsProxyAgent} from "https-proxy-agent";
import fetch from "node-fetch";
const {Builder, By} = require('selenium-webdriver');
const cheerio = require('cheerio');
const proxy = require('selenium-webdriver/proxy');
interface RegexData {
    title?: string,
    description?: string,
    price?: string,
    delivery?: string
}

interface ParseString{
    imgHref: string,
    page: string,
    detail: RegexData
}

const customHeaders = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
    "cache-control": "max-age=0",
    "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": "\"\"",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-ch-ua-platform-version": "\"13.4.1\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "bbxDmpSegments=[]; bbxLastViewed={\"bap\":{\"adListV2\":[{\"adId\":711377787,\"viewed\":1694246326220},{\"adId\":700229269,\"viewed\":1694245793997},{\"adId\":711134692,\"viewed\":1694165255294}]}}; IADVISITOR=63a328d0-30a0-4dc6-84b0-903599c76014; context=prod; TRACKINGID=10f52b61-79f6-45b5-929b-3fe0d50ef359; x-bbx-csrf-token=17395cac-d742-4ee4-a4b7-05e0783f4eb7; atidvisitor=%7B%22name%22%3A%22atidvisitor%22%2C%22val%22%3A%7B%22vrn%22%3A%22-612451-%22%7D%2C%22options%22%3A%7B%22path%22%3A%22%2F%22%2C%22session%22%3A31536000%2C%22end%22%3A31536000%7D%7D; RANDOM_USER_GROUP_COOKIE_NAME=9; didomi_token=eyJ1c2VyX2lkIjoiMThhNjk1MjktZmNkOC02ZGQxLWJkZTItNzNlNmUxNzlmN2FjIiwiY3JlYXRlZCI6IjIwMjMtMDktMDZUMDc6MDk6MDAuMzE2WiIsInVwZGF0ZWQiOiIyMDIzLTA5LTA2VDA3OjA5OjAwLjMxNloiLCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsiYW1hem9uIiwiZ29vZ2xlIiwiYzpvZXdhLVhBUW1HU2duIiwiYzphbWF6b24tbW9iaWxlLWFkcyIsImM6aG90amFyIiwiYzp1c2Vyem9vbSIsImM6YW1hem9uLWFzc29jaWF0ZXMiLCJjOnh4eGx1dHprLW05ZlFrUHRMIiwiYzpvcHRpb25hbGUtYm5BRXlaeHkiXX0sInB1cnBvc2VzIjp7ImVuYWJsZWQiOlsieHh4bHV0enItcWtyYXAzM1EiLCJnZW9sb2NhdGlvbl9kYXRhIiwiZGV2aWNlX2NoYXJhY3RlcmlzdGljcyJdfSwidmVuZG9yc19saSI6eyJlbmFibGVkIjpbImdvb2dsZSIsImM6d2lsbGhhYmVuLVpxR242WXh6Il19LCJ2ZXJzaW9uIjoyLCJhYyI6IkFrdUFFQUZrQkpZQS5Ba3VBRUFGa0JKWUEifQ==; euconsent-v2=CPxrYoAPxrYoAAHABBENDVCsAP_AAH_AAAAAIzNf_X_fb2_j-_59f_t0eY1P9_7_v-0zjhedk-8Nyd_X_L8X52M5vB36pqoKuR4ku3bBAQdlHOHcTQmw6IkVqSPsbk2Mr7NKJ7PEmlMbM2dYGH9_n9XT-ZKY79__f__z_v-v___97r__7-3f3_vp9V-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA3QAkw0LiALsCRkJtowigRAjCsJCoBQAUQCQtEBhCSuCnZXAT6wGQAARQAHBACGAFGQAIAAAIAkIgAECOBAABAIBAACABUIBAARoAAoAJAQCAAUB0LAKKAJQLCDIhIiFMCECRIKCeQIQSg_UEcIQyigAAA.f_gAD_gAAAAA; permutive-id=2f44d28c-4deb-4fb5-a052-29ded172f961; IS_FIRST_AD_REQUEST_V2=false; CONSENT_FOR_FIRST_PARTY_COOKIES=true; FIRST_PARTY_TRACKINGID=10f52b61-79f6-45b5-929b-3fe0d50ef359; id5id.1st=%20%7B%20%22created_at%22%3A%20%222023-06-04T12%3A00%3A07.94Z%22%2C%20%22id5_consent%22%3A%20true%2C%20%22original_uid%22%3A%20%22ID5*G7H_FJgSwL47x3NOZCH44lIg8jZUpnjcQbfnHoUwATtgTvfdmPXiox2ersCSztEdYFL41lOwkzAW2hhKGR1gBmBTxQgnsFuJNwtiJZhHuaBgVL8Xs-6KGyqqV4SGCVAkYFWP-V5NxZsNgUTZfAJyw2BW48cbuQNm5kOYLPUJyCpgWO1eyTdHnY7VgGUwEpwqYF1bnyfxHz-a5Q9DXzUGwmBflpuV--uEFONdmJTtXndgYfMHD5k6lTPmHquKOwO6YGLdKroPa4hIv8G4KqBcUGBjYGKK2ZjHTpOndMwOmmxgZZB267yRpb-zqtE0OfPRYGbmjK6hhjzOLjqkprclDmBn_8nhxpq6lpyony-BukZgaXReOlb3d6Y55WYmBNhdYGpDbsjdO7rf1QL-sMh9_WBrJvZ1JfS_hmTtMziqdAFgb7XErCJ0Ea9woX1D-F3kYHBWNwS6w0RLm-pYfNYQY2BzMOU8gMYo7WUhJf3tSCJgdrK219VmsXyAapNysJqzYHoqFW3thGgZbOcgt0nwxWB7TYYRn_NmMN_N1IUSLa9gf-A1BRyuQSvQ80THKhMHYFDkK6elLb1CH9a3X41CQA%22%2C%20%22universal_uid%22%3A%20%22ID5*WC4CXGmso7dhuID4BUjKHefKFneMmT87tDii-UGtHpFgTnV8kZ0pDnx4GR8A6wQnYFKLqtxm3ycQUznuKJS-D2BTTXIAVHtBpViPumTHsdVgVLOkRAeWZ9jzylnxahF4YFUyKpaWvfnHxteIQDh_iGBWpKBKlgjigLJky1cA8W5gWCczPuLlqnVAWlxz1zJNYF1mnbGsFj442PmOdTfI0GBfXFN1IQsUn7bkPq1KF-RgYQon2GBEP45ocLQkTtvMYGLwYhfCMiZThSsEAWao9mBj7Ywo2gWSuq3fDQjdc_xgZSFNdn6sclQiIM35BBAPYGZJwq6AZ1wXVwHXdA-26WBnXbeFwi9AOic1jwFXluRgaWxwBPEYzHfQ_S3VV7QBYGrYfgzC2Ck0Ja2dQUgFp2BrbC61rrxtm6dwiWQ8qc5gb7GEo7mpPuRtT_ecvd-KYHBIy8mRW2FG2cr2gHlMTGBzzM4eA5pnL0tx9lsUxFhgdvEr1hqZZCdvbUjLokjbYHqqzR1v7p_5lnA_h4yL12B7Wg2QTeosJv8ZcAx-eWhgf-jna0Y5-jBrJJcQlc0FYFBPzcFUVsk4MlP2yYIdBg%22%2C%20%22signature%22%3A%20%22ID5_AqPoINNERFfw5BM26h32EYZvdgkGHDv1nN3IHtwelhtIkTgYQe4yMQK3tMkk5uEH_caFNO0lq76zgttFN_gI1JXZEN3yt50P2qv3B0JygGhxR2H0WhH-e0ki%22%2C%20%22link_type%22%3A%202%2C%20%22cascade_needed%22%3A%20true%2C%20%22privacy%22%3A%20%7B%20%22jurisdiction%22%3A%20%22gdpr%22%2C%20%22id5_consent%22%3A%20true%7D%2C%20%22ext%22%3A%20%7B%20%22linkType%22%3A%202%2C%20%22pba%22%3A%20%22wD%2BvHKUa02vqOdGdVdlAfA%3D%3D%22%7D%2C%20%22cache_control%22%3A%20%7B%20%22max_age_sec%22%3A%207200%20%7D%7D; id5id.1st_last=1694242412649; SRV=4|ZPwjm; _pulse2data=c7b89409-5c36-457b-baa3-e2b24d3beb0c%2Cv%2C%2C1694246682166%2CeyJpc3N1ZWRBdCI6IjIwMjMtMDYtMDNUMDk6MjU6MDRaIiwiZW5jIjoiQTEyOENCQy1IUzI1NiIsImFsZyI6ImRpciIsImtpZCI6IjIifQ..18F-RHYUTUP4QXvEKWCBEg.xuy4JUDOFNYqECQX5uRL6dahmABnNOEVToFZyRJEpdSTgjo1tu1OqXYhNmBd7gl0aBsW3Af4z7xFj6_CiQupCP9yxsfFNqapmmAE12DUiGPl7XzhJq2t0Vs5lBjxRlIlqOxvELmK69SfKjkCwhb82Sm5c79nfrjX3Jwe3prN5rHvABJr9A10PWMkFsKiwZZ2_XFiNSd4sUMVAvfm2hJIKw.sOFwsMW72crNPdL6Tuagaw%2C%2C%2Ctrue%2C%2CeyJraWQiOiIyIiwiYWxnIjoiSFMyNTYifQ..PdZSPg7ur0NSF3u1k_BNw2u9v2R_S8aIZSee7LD1Y-E; atuserid=%7B%22name%22%3A%22atuserid%22%2C%22val%22%3A%229d85d0ee-0557-4454-bbca-4698c265c500%22%2C%22options%22%3A%7B%22end%22%3A%222024-10-10T07%3A49%3A42.177Z%22%2C%22path%22%3A%22%2F%22%7D%7D; ioam2018=000209b3ea121a71064f82589:1724310537209:1693984137209:.willhaben.at:13:at_w_atwillhab:Service/Rubrikenmaerkte/Sonstiges/Games_Konsolen/DA:noevent:1694245782181:cofpqx; id5id.1st_426_nb=1; cto_bundle=89umhF9uc281Z21QeTFLb2hCTWFUUUVWcGo0NU9rYzhUSjJXQXhJYjNvU3clMkJuZGNyVSUyRk1vZWRsNjVZUFBOaDRJSWpCRkhlczVUa1B6eEc1SDVLMENzNE5ZTkslMkZ1ZU9BZXp4TFdWVGRNUzRRVEZPcVAwTE14b25lZjVsTzZ6UWlVdjFVME9meHZiQTVHMlZsME5hdGhpTUwxJTJCdjNmSXdQdTJBUWR3blJRNXdPVWVnb05tREQzeXFqakdpcjJJZXF5cnlzM0FOa0ppelpMRUpjRTkzVnlva0lmdXclM0QlM0Q; COUNTER_FOR_ADVERTISING_FIRST_PARTY_UID_V2=2",
    "Referer": "https://www.willhaben.at/iad",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};

export const parseStringAnibis = async (url: string, ctx: Context): Promise<ParseString | undefined> => {
    const chrome = require('selenium-webdriver/chrome')
    const options = new chrome.Options()

    try {
        options.setMobileEmulation({ deviceName: 'iPhone X' }); // Пример настройки мобильного устройства (необязательно)
        options.addArguments('--disable-dev-shm-usage')
        options.addArguments('--no-sandbox')
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-web-security');
        options.addArguments('--disable-features=IsolateOrigins,site-per-process,DisallowFetchForDocWrittenScripts');
        options.addArguments(`--user-agent=${customHeaders['User-Agent']}`);

        // options.addArguments('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')

        let body = ''

        // let driver = await new Builder()
        //     .forBrowser('chrome')
        //     .setChromeOptions(options)
        //     .build()

        try {

        } catch (e) {
            await ctx.reply(`Ошибка драйвера: ${e.toString()}`)
            return undefined
        } finally {
            // await driver.quit();
        }

        if (!body) throw new SyntaxError("await parse.text() -- Данные некорректны\n\n " + body);

        const $ = cheerio.load(body)

        await fs.writeFileSync('page.html', body, "utf-8")
        const data = await getInfo(body)

        if (data === undefined) throw new SyntaxError("Некорректная работа регулярного выражения \n\n" + data)

        let imgHref = await getImgHref($)
        if (!imgHref)   imgHref = '0'

        return {
            imgHref,
            detail: data,
            page: body,
        }
    } catch (e) {
        log.warn(e)
        console.log(e)
        ctx.reply("Ошибка парсинга")
        return undefined
    }
}

const getInfo = async (body: string): Promise<RegexData | undefined> => {
    const priceRegex = /<span data-testid="contact-box-price-box-price-value" class=".+?">.\s+(?<price>\d+)/gmi.exec(body);
    const deliveryRegex = /\+\<\!\-\- \-\-\>\s\<span.+?">€\s+(?<deliveryPrice>[\d,.]+)/gmi.exec(body);
    const titleRegex = /<meta property="og:title" content="(?<title>.*?)"/gmsi.exec(body);
    const descriptionRegex = /<meta property="og:description" content="(?<description>.*?)"/gmsi.exec(body);

    if (!titleRegex?.groups?.title
        || !descriptionRegex?.groups?.description
        || !priceRegex?.groups?.price
    ) return undefined

    let del = deliveryRegex?.groups?.deliveryPrice
    return {
        title: titleRegex.groups?.title,
        description: descriptionRegex?.groups?.description,
        price: priceRegex?.groups?.price,
        delivery: (del) ? del.replace(',','.') : '0',
    }
}

const getImgHref = async ($: typeof cheerio) => {
    try {
        return await $('.galleryimage-element > img').data('imgsrc')
    } catch (e) {
        return undefined
    }
}