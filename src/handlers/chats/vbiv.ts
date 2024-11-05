import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {getUsername} from "@/helpers/getUsername";
import {userRepository} from "@/database";
import {handlerMenu} from "@/handlers/menu/command";
import {UserRole} from "@/database/models/user";

export const composer = new Composer<Context>()
const regex = /^\/vbiv/gmi
composer.hears(regex, handler)
composer.callbackQuery('vbiv', handler)

async function handler(ctx: Context)  {
    if (!ctx.callbackQuery) {
        try {
            ctx.deleteMessage()
        }catch (e) {
        }
    }
    const vbivers = await userRepository.find({
        where: {
            naVbive: true,
            role: UserRole.VBIVER
        }
    })
    let text = `💳 Сейчас на вбиве\n`
    for (const vbiver of vbivers) {
        text += `\n🪆 <b>${await getUsername(vbiver)}</b>`
    }

    return ctx.reply(text, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })

}