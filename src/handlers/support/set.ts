import {Composer} from "grammy";
import {Context} from "../../database/models/context";
import console from "console";
import {userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /^support set (?<type>\w+)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const type = match.groups.type

    if (type === 'our') {
        ctx.user.supportTeam = true
        await userRepository.save(ctx.user)
        return ctx.reply('Установленa наша тех. поддержка', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    } else {
        ctx.user.supportTeam = false
        await userRepository.save(ctx.user)
        return ctx.scenes.enter('support-update-code')
    }
}
