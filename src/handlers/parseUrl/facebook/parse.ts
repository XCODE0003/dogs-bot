import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, Keyboard} from "grammy";
// import {parseStringFacebook} from "@/handlers/parseUrl/facebook/parseStringFacebook";
import {Ads} from "@/database/models/ads";
import {adsRepository, domensRepository, profilesRepository, userRepository} from "@/database";
import moment from 'moment';
import {User, UserRole} from "@/database/models/user";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import {Scene} from "grammy-scenes";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {redis} from "@/utils/setupSession";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {getService} from "@/helpers/getServices";
import {Profiles} from "@/database/models/profiles";
import {parseStringFacebook} from "@/handlers/parseUrl/facebook/parseStringFacebook";
import {getDomen} from "@/helpers/getDomen";

export const composer = new Composer<Context>()
const regex = /facebook\.(?<platform>com)\/(?<link>.+)\//gm
composer.hears(regex, handler)
moment.locale('ru')

async function preCreateAd(ctx, parse, match, profileId) {
    const profile = await profilesRepository.findOne({
        where: {id: profileId}
    })
    if (!profile) return ctx.reply('profile undefined error')

    const {ads, newAd} = await createAd(parse, ctx, match, profile)

    const domen = await getDomen(ctx.user,'facebook')
    if (!domen) return ctx.reply('domen undefined error')

    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption:`
${(newAd) ? '🪄 Ссылка создана!' : '🪄 Ссылка была создана ранее!'}

🐨 ID объявления: <code>${ads.date}</code>

🌳 <b>Название:</b> <code>${ads.title}</code>
🌳 <b>Цена:</b> <code>${ads.price}</code>
🌳 <b>Платформа: FACEBOOK [HU 🇭🇺]</b>
♻️ <b>Домен сменён ${moment(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>FACEBOOK:</b> <a href="https://${domen.link}/link/${ads.link}">LINK [2.0]</a>

🚚 <b>FOXPOST:</b> <a href="https://${domen.link}/service/foxpost/${ads.link}">FOXPOST LINK</a>
🚚 <b>GLS:</b> <a href="https://${domen.link}/service/gls/${ads.link}">GLS LINK</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ads.id, ctx.user)
    })
}

const createKeyboard = async (id: Number, user: User) => {
    const keyb = new InlineKeyboard()
        // .text("🙊 Настройки", `settings ad ${id}`)

    keyb.row()

    keyb.text("📲 SMS", `sms facebook hu ad ${id}`)
    keyb.text("💌 EMAIL", `email facebook hu ad ${id}`)

    keyb.row()
    keyb.text("⚙ Настройки", `settings ad ${id}`)
    keyb.row()
    keyb.text("Главное меню", `menuWithPicture`)

    return keyb

}
async function handler (ctx: Context) {
    const match = regex.exec(ctx.msg.text)
    const parse = await parseStringFacebook(`https://facebook.com/${match.groups.link}`, ctx)
    if (parse === undefined) return null

    match[1] = 'hu'
    match.groups['platform'] = 'hu'

    return ctx.scenes.enter('setDeliveryAmountFacebook', {
        parse, match
    })
}

async function cancel (ctx) {
    try {
        await deleteAllMessages (ctx.session.deleteMessage,ctx)
    } catch (e) {}
    ctx.scene.exit()
}

export const scene = new Scene<Context>('setDeliveryAmountFacebook')

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []
    ctx.session.anyObject = ctx.scene.arg

    const res = await ctx.reply(
        // @ts-ignore
        `${getFlagEmoji(ctx.session.anyObject?.match?.[1])} <b>FACEBOOK</b>\nИтоговая цена: <code>${ctx.session.anyObject?.parse?.detail?.price}</code>`, {


            reply_markup: {
                inline_keyboard: [
                    [{text: 'Указать цену доставки', callback_data: 'no skip'}],
                    [{text: 'Пропустить', callback_data: 'skip'}]
                ]
            }
        })
    ctx.session.deleteMessage.push(res.message_id)
    return ctx.scene.resume()
})

scene.wait().callbackQuery(/skip|no skip/, async ctx => {
    try {
        ctx.deleteMessage()
    } catch (e) {}

    if (ctx.callbackQuery.data === 'no skip') {
        const res = await ctx.reply(
            `🌱 <b>Введи цену доставки:</b>
<code>Пример: 23.99</code>`, {})
        ctx.session.deleteMessage.push(res.message_id)
    } else {
        return ctx.scene.goto('choiceProfile')
    }
    return ctx.scene.resume()
})


scene.wait().hears(/(^\d+\.\d\d)|(^\d+)/, async ctx => {
    try {
        ctx.session.deleteMessage.push(ctx.msg.message_id)
    } catch (e) {}
    const userPrice = parseInt(ctx.match[0])
    // @ts-ignore
    const price = parseInt(String(ctx.session.anyObject.parse.detail.price).replace(/ /g, ''))

    const newPrice = `${userPrice + price}`.split('').reverse().map((el, index) => index % 3 !== 2 ? el : ` ${el}`).reverse().join('') + ' ft'

    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = newPrice
    ctx.scene.resume()
})


scene.label('choiceProfile')

scene.do(async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    const service = getService('facebook')
    // @ts-ignore
    const country = ctx.session.anyObject?.match?.[1]

    const keyboard = new InlineKeyboard()

    const profiles = await profilesRepository.find({
        relations: { user: true },
        where: {
            service: service.name,
            country: country,
            user: {
                tgId: ctx.user.tgId
            }
        }
    })
    if (profiles.length === 0) {
        await ctx.reply(`
<b>${getFlagEmoji(country)} ${service.name.toUpperCase()}</b>
Создай профиль для этой площадки и заново спарси ссылку`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }
    profiles.slice(0,9)
    for (const i in profiles) {
        const profile = profiles[i]
        if (i === '3' || i === '6' || i === '9') { keyboard.row() }
        keyboard.text(`${(profile.fullName.length > 9) ? profile.fullName.slice(0,9) + '...' : profile.fullName}`, `set profile ${profile.id}`)
    }

    const res = await ctx.reply(`Выбери профиль для <b>${getFlagEmoji(country)} ${service.name.toUpperCase()}</b>`, {
        reply_markup: keyboard
    })
    ctx.session.deleteMessage.push(res.message_id)
})

scene.wait().callbackQuery(/^set profile (\d+)$/gmi, async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match,/^set profile (\d+)$/gmi.exec(ctx.callbackQuery.data)[1])
})


const createAd = async (parse,ctx, match, profile: Profiles) => {
    const oldAd = await adsRepository.findOne({
        relations: {author: true},
        where: {
            originallink: match[2],
            country: match[1],
            service: 'facebook',
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
    ads.price = parse.detail.price
    ads.img = parse.imgHref
    ads.link = `${match[2]}${date}`
    ads.originallink = `${match[2]}`
    ads.date = `${date}`
    ads.country = match[1]
    ads.profile = profile
    ads.service = 'facebook'
    ads.author = ctx.user
    ads.created = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    await adsRepository.save(ads)
    return {
        ads,
        newAd: true
    }
}
