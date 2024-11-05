import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Ads} from "@/database/models/ads";
import {adsRepository, domensRepository, profilesRepository, userRepository} from "@/database";
import moment from 'moment';
import {User} from "@/database/models/user";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import {Scene} from "grammy-scenes";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {parseStringVinted} from "@/handlers/parseUrl/vinted/parseStringVinted";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {getService} from "@/helpers/getServices";
import {Profiles} from "@/database/models/profiles";
import {getDomen} from "@/helpers/getDomen";
import console from "console";

export const composer = new Composer<Context>()
const regex2 = /vinted\.(?<platform>\w+)\/(?<link>.+)\?/gm
const regex = /vinted\.(?<platform>\w+)\/(?<link>.+)/gm
composer.hears(regex, handler)
moment.locale('ru')

async function preCreateAd(ctx, parse, match) {
    const {ads, newAd} = await createAd(parse, ctx, match)

    const domen = await getDomen(ctx.user,'vinted')
    if (!domen) return ctx.reply('domen undefined error')

    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption:`
Фиш готов 👌

🆔 ID: <code>${ads.date}</code>

📦 <b>Товар:</b> <code>${ads.title}</code>
💸 <b>Цена:</b> <code>${ads.price}</code>
💡 <b>Платформа: VINTED [${match[1].toUpperCase()} ${getFlagEmoji(match[1])}]</b>
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
    keyb.text("⚙ Настройки", `settings ad ${id}`)
    keyb.row()
    keyb.text("Главное меню", `menuWithPicture`)

    return keyb

}
async function handler (ctx: Context) {
    const parse = await parseStringVinted(ctx.msg.text, ctx)
    if (parse === undefined) return null
    let match = regex2.exec(ctx.msg.text)

    if (!match) {
        match = regex.exec(ctx.msg.text)
    }
    return ctx.scenes.enter('setDeliveryAmountVinted', {
        parse, match
    })
}

async function cancel (ctx) {
    try {
        await deleteAllMessages (ctx.session.deleteMessage,ctx)
    } catch (e) {}
    ctx.scene.exit()
}

export const scene = new Scene<Context>('setDeliveryAmountVinted')

scene.always().callbackQuery(/skip setDeliveryAmountVinted/, async ctx => {
    // @ts-ignore
    await preCreateAd(ctx,  ctx.session.anyObject.parse, ctx.session.anyObject.match)
    return cancel(ctx)
})

scene.always().callbackQuery(/vinted setDeliveryInAd/, async ctx => {
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

    const res = await ctx.reply(`<b>Введи цену товара (без доставки):</b>`, {})
    ctx.session.deleteMessage.push(res.message_id)
    return ctx.scene.resume()
})

scene.wait().hears(/(^\d+\.\d\d)|(^\d+)/, async ctx => {
    try {
        ctx.deleteMessage()
    } catch (e) {}

    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = ctx.message.text
    // @ts-ignore
    ctx.session.anyObject.parse.detail.deliveryPrice = ctx.message.text + ' €'
    return ctx.scene.resume()
})


scene.do(async (ctx) => {
    let keyb = []

    // @ts-ignore
    // if (ctx.session.anyObject?.parse?.detail?.totalPrice !== undefined) {
    //     keyb.push([{text: '🌳 Использовать цену с обьявления', callback_data: 'vinted setDeliveryInAd'}])
    // }
    keyb.push([{text: 'Пропустить', callback_data: 'skip setDeliveryAmountVinted'}])

    // @ts-ignore
    const res = await ctx.reply(`<b>Введи цену доставки товара:</b>\n<code>Пример: 23.99</code>`, {
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
    ads.deliveryPrice = parse.detail.deliveryPrice
    ads.img = parse.imgHref
    ads.link = `${match[2]}${date}`
    ads.originallink = `${match[2]}`
    ads.date = `${date}`
    ads.country = "at"
    ads.service = 'vinted'
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
