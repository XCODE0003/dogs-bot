import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {getUsername} from "@/helpers/getUsername";
import {profitRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /^\/me/gmi
composer.hears(regex, handler)

async function handler(ctx: Context)  {
    ctx.deleteMessage()

    const profits = await profitRepository.find({
        relations: {worker: true},
        where: {
            worker: {
                tgId: ctx.user.tgId
            }
        }
    })

    let amount = 0
    for (const profit of profits) { amount += profit.workerValue}

    let text = `🧸 ${await getUsername(ctx.user)}`
    text += `\n\n<b>🏷 Заработано: ${amount} USD</b>`

    return ctx.reply(text)

}