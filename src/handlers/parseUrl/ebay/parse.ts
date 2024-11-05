import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {parseStringEbay} from "@/handlers/parseUrl/ebay/parseStringEbay";
import {Ads} from "@/database/models/ads";
import {adsRepository, domensRepository, userRepository} from "@/database";
import moment from 'moment';
import {User, UserRole} from "@/database/models/user";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import {Scene} from "grammy-scenes";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {redis} from "@/utils/setupSession";
import {getDomen} from "@/helpers/getDomen";
const { chromium } = require('playwright');

export const composer = new Composer<Context>()
const regex = /kleinanzeigen\.(?<platform>.+?)\/(?<link>.+)/gm
const regex2 = /kleinanzeigen\.(?<platform>.+?)\/(?<link>.+)\?/gm
composer.hears(regex, handler)
moment.locale('ru')

async function preCreateAd(ctx, parse, match,deliveryPrice) {
    const {ads, newAd} = await createAd(parse, ctx, match,deliveryPrice)

    const domen = await getDomen(ctx.user,'ebay')
    if (!domen) return ctx.reply('domen undefined error')
    let msg = await ctx.reply('⏳ Создание qr...')
    try {
        const browser = await chromium.launch({
            args: ['--disable-dev-shm-usage', '--no-sandbox'],
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(`http://${domen.link}/link/${ads.link}?qrcode=true`);
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `temp/qrcode_${ads.date}.png` });
    } catch (e) {
        console.log(e)
    }
    try {
        await ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
    } catch (e) {
        console.log(e)
    }
    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption:`
Фиш готов 👌

🆔 ID: <code>${ads.date}</code>

📦 <b>Товар:</b> <code>${ads.title}</code>
💸 <b>Цена:</b> <code>${ads.price}</code>
💡 <b>Платформа: EBAY [${match[1].toUpperCase()} 🇩🇪]</b>
♻️ <b>Домен сменён ${moment(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖ 
🌠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ads.link}">LINK [2.0]</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ads.id, ctx.user)
    })
}
const createKeyboard = async (id: Number, user: User) => {
    const keyb = new InlineKeyboard()
        // .text("🙊 Настройки", `settings ad ${id}`)

    keyb.row()


    keyb.text("📲 SMS", `sms ad ${id}`)
    keyb.text("💌 EMAIL", `email ad ${id}`)

    keyb.row()
    keyb.text("🎲 QR-code", `qrcode get ${id}`)
    keyb.text("⚙ Настройки", `settings ad ${id}`)
    keyb.row()
    keyb.text("Главное меню", `menuWithPicture`)

    return keyb

}
async function handler (ctx: Context) {
    const parse = await parseStringEbay(ctx.msg.text, ctx)

    if (parse === undefined) return null
    let match = undefined
    match = regex2.exec(ctx.msg.text)
    if (!match) {
        match = regex.exec(ctx.msg.text)
    }


    return ctx.scenes.enter('setDeliveryAmount', {
        parse, match
    })
}

async function cancel (ctx) {
    await deleteAllMessages (ctx.session.deleteMessage,ctx)
    try {
        ctx.scene.exit()
    } catch (e) {}
}

export const scene = new Scene<Context>('setDeliveryAmount')

scene.always().callbackQuery(/skip setDeliveryAmount/, async ctx => {
    const userPrice = 5.99
    // @ts-ignore
    const price = ctx.session.anyObject.parse.detail.price = ctx.session.anyObject.parse.detail.price.replace(/\./,'')

    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = (userPrice + parseFloat(price)).toFixed(2) + ' €'
    // @ts-ignore
    console.log(ctx.session.anyObject.parse.detail.price)
    // @ts-ignore
    await preCreateAd(ctx,  ctx.session.anyObject.parse, ctx.session.anyObject.match, '5.99 €')
    return cancel(ctx)
})

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []
    ctx.session.anyObject = ctx.scene.arg

    const res = await ctx.reply('<b>🚚 Цена доставки: </b>', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Пропустить', callback_data: 'skip setDeliveryAmount'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)
    return ctx.scene.resume()
})

scene.wait().hears(/(^\d+\.\d\d)|(^\d+)/, async ctx => {
    try {
        ctx.deleteMessage()
    } catch (e) {}

    const userPrice = parseFloat(ctx.match[0])
    // @ts-ignore
    const price = ctx.session.anyObject.parse.detail.price = ctx.session.anyObject.parse.detail.price.replace(/\./,'')

    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = (userPrice + parseFloat(price)).toFixed(2) + ' €'

    console.log(ctx.match[0], userPrice, price, parseFloat(price))
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match, userPrice + ' €')
    return cancel(ctx)
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createAd = async (parse,ctx, match,deliveryPrice) => {

    const unix = String(Date.now())
    const randomInt1 = getRandomInt(0,5)
    const randomInt2 = getRandomInt(666, 4657645344567)
    const date = `${unix.slice(13 - randomInt1,13)}` + randomInt2
    const ads = new Ads()

    ads.title = parse.detail.title
    ads.description = parse.detail.description
    ads.price = parse.detail.price
    ads.img = parse.imgHref
    ads.link = `${match[2]}${date}`
    ads.originallink = `${match[2]}`
    ads.deliveryPrice = deliveryPrice
    ads.date = `${date}`
    ads.country = match[1]
    ads.service = 'ebay'
    ads.author = ctx.user
    ads.page = parse.page
    ads.pageMobile = parse.pageMobile
    ads.created = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    await adsRepository.save(ads)
    return {
        ads,
        newAd: true
    }
}
