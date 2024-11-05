import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {profitRepository} from "@/database";
import {config} from "@/utils/config";

const regex = /admin set paid (?<status>\w+) (?<id>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.update.callback_query.data)
    const id = match.groups.id
    const status = match.groups.status

    const profit = await profitRepository.findOne({
        where: {id: Number(id)}
    })
    if (!profit) return ctx.reply('Профит не найден')

    profit.isPaid = (status === 'true')

    await profitRepository.save(profit)

    if (status !== 'true') {
        await ctx.api.editMessageReplyMarkup(config.chats.payments,profit.msgId, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "⌚ Выплачивается ⌚", callback_data: `vyplata ${profit.id}`}]
                ]
            }
        })

        return ctx.editMessageReplyMarkup({
            reply_markup: {
                inline_keyboard: [
                    [{text: "♻️ Не выплатил", callback_data: `admin set paid true ${profit.id}`}]
                ]
            }
        })
    }

    await ctx.api.editMessageReplyMarkup(config.chats.payments,profit.msgId, {
        reply_markup: {
            inline_keyboard: [
                [{text: "💗 ВЫПЛАЧЕНО", callback_data: `vyplata ${profit.id}`}]
            ]
        }
    })

    return ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: [
                [{text: "👍🏼 Выплатил", callback_data: `admin set paid false ${profit.id}`}],
            ]
        }
    })
}