import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {parseStringWallhaben} from "@/handlers/parseUrl/wallhaben/parseStringWallhaben";
import {Ads} from "@/database/models/ads";
import {adsRepository, domensRepository, userRepository} from "@/database";
import moment from 'moment';
import {User, UserRole} from "@/database/models/user";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import {Scene} from "grammy-scenes";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {redis} from "@/utils/setupSession";
import {getDomen} from "@/helpers/getDomen";

export const composer = new Composer<Context>()
const regex = /anibis\.(?<platform>ch)\/(?<link>.+)/gm
const regex2 = /anibis\.(?<platform>ch)\/(?<link>.+)\?/gm
composer.hears(regex, handler)
moment.locale('ru')

async function preCreateAd(ctx, parse, match) {
    const {ads, newAd} = await createAd(parse, ctx, match)

    const domen = await getDomen(ctx.user,'anibis')
    if (!domen) return ctx.reply('domen undefined error')

    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption:`
${(newAd) ? '🪄 Ссылка создана!' : '🪄 Ссылка была создана ранее!'}

🐨 ID объявления: <code>${ads.date}</code>

🌳 <b>Название:</b> <code>${ads.title}</code>
🌳 <b>Цена:</b> <code>${ads.price}</code>
🌳 <b>Платформа: ANIBIS [${match[1].toUpperCase()} 🇦🇹]</b>
♻️ <b>Домен сменён ${moment(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ads.link}">LINK [2.0]</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ads.id, ctx.user)
    })
}

const createKeyboard = async (id: Number, user: User) => {
    const keyb = new InlineKeyboard()
        // .text("🙊 Настройки", `settings ad ${id}`)

    keyb.row()


    keyb.text("📲 SMS", `sms addd ${id}`)
    keyb.text("💌 EMAIL", `email ad ${id}`)

    keyb.row()
    keyb.text("⚙ Настройки", `settings ad ${id}`)
    keyb.row()
    keyb.text("Главное меню", `menuWithPicture`)

    return keyb

}
async function handler (ctx: Context) {
    // if (ctx.from.id !== 5685044944) return null
    const parse = await parseStringWallhaben(ctx.msg.text, ctx)

    if (parse === undefined) return null
    let match = undefined
    match = regex2.exec(ctx.msg.text)
    if (!match) {
        match = regex.exec(ctx.msg.text)
    }


    return ctx.scenes.enter('setDeliveryAmountAnibis', {
        parse, match
    })
}

async function cancel (ctx) {
    await deleteAllMessages (ctx.session.deleteMessage,ctx)
    try {
        ctx.scene.exit()
    } catch (e) {}
}

export const scene = new Scene<Context>('setDeliveryAmountAnibis')

scene.always().callbackQuery(/skip setDeliveryAmountAnibis/, async ctx => {
    // @ts-ignore
    await preCreateAd(ctx,  ctx.session.anyObject.parse, ctx.session.anyObject.match)
    return cancel(ctx)
})

scene.always().callbackQuery(/willhaben setDeliveryInAd/, async ctx => {
    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = Number(Number(ctx.session.anyObject.parse.detail.price) + Number(ctx.session.anyObject.parse.detail.delivery)).toFixed(2)

    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match)
    return cancel(ctx)
})

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []
    ctx.session.anyObject = ctx.scene.arg

    let keyb = []

    // @ts-ignore
    if (ctx.session.anyObject?.parse?.detail?.delivery !== undefined) {
        keyb.push([{text: '🌳 Использовать цену с обьявления', callback_data: 'willhaben setDeliveryInAd'}])
    }
    keyb.push([{text: 'Пропустить', callback_data: 'skip setDeliveryAmountAnibis'}])

    // @ts-ignore
    const res = await ctx.reply(`<b>📍 Цена доставки в обьявлении: <code>€ ${ctx.session.anyObject?.parse?.detail?.delivery}</code></b>\n\n🌱 <b>Введи цену доставки:</b>\n<code>Пример: 23.99</code>`, {
        reply_markup: {
            inline_keyboard: keyb
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
    ctx.session.anyObject.parse.detail.price = (userPrice + parseFloat(price)).toFixed(2)

    console.log(ctx.match[0], userPrice, price, parseFloat(price))
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match)
    return cancel(ctx)
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createAd = async (parse,ctx, match) => {

    const unix = String(Date.now())
    const randomInt1 = getRandomInt(0,5)
    const randomInt2 = getRandomInt(666, 4657645344567)
    const date = `${unix.slice(13 - randomInt1,13)}` + randomInt2
    const ads = new Ads()

    ads.title = parse.detail.title
    ads.description = parse.detail.description
    ads.price = "€ " + parse.detail.price
    ads.img = parse.imgHref
    ads.link = `${match[2]}${date}`
    ads.originallink = `${match[2]}`
    ads.date = `${date}`
    ads.country = match[1]
    ads.service = 'anibis'
    ads.author = ctx.user
    ads.page = parse.page
    ads.created = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    await adsRepository.save(ads)
    return {
        ads,
        newAd: true
    }
}
