import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {profitRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /mentors remove/
composer.callbackQuery(regex, callbackHandler)

async function callbackHandler(ctx: Context)  {
    const profits = await profitRepository.find({
        where: {
            worker: ctx.user,
            mentor: ctx.user.mentor
        }
    })

    return ctx.reply(`Наставник уберется автоматически после ${ctx.user.mentor.freedom} профитов.\nУ вас ${profits.length}`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Закрыть", callback_data: `deleteThisMessage`}]
            ]
        }
    })
}