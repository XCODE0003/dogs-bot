import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {adsRepository, logsRepository} from "@/database";
import moment from "moment";
import {stickerList} from "@/utils/stickerList";

export const composer = new Composer<Context>()
composer.callbackQuery(/info\s+(?<ad>\d+)\s+(?<ip>.+)/gmsi, callbackHandler)
composer.command('start', async (ctx) => {
    await ctx.deleteMessage()
    return ctx.replyWithSticker(stickerList['hello'])
})

async function callbackHandler(ctx: Context)  {
    const regex = /info\s+(?<ad>\d+)\s+(?<ip>.+)/gmsi
    const match = regex.exec(ctx.match[0])

    const ad = await adsRepository.findOne({
        where: {
            date: match.groups.ad
        }
    })

    if (!ad) return

    const data = await logsRepository.findOneBy({
        ip: match.groups.ip,
        ad
    })
    if (!data) return

    return ctx.answerCallbackQuery({
        text: `
🤔 Переход: ${data.page}
🕰 ${moment(new Date(data.seen)).fromNow()}
        `.replace('\n', ''),
        show_alert: true
    })
}