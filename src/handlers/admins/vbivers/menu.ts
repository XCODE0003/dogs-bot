import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {userRepository} from "@/database";
import {UserRole} from "@/database/models/user";

const regex = /admin vbivers menu/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const vbiversCount = await userRepository.find({
        where: {
            role: UserRole.VBIVER
        }
    })
    let text = `🧞 Вбиверов: ${vbiversCount.length}`

    text += `<code>\n\n/admin vbiver {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`

    return ctx.editMessageCaption( {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Список', callback_data: 'admin vbiver list'}],
                [{text: 'Назад', callback_data: 'admin menu'}]
            ]
        }
    })
}

export async function vbiverMenu(ctx: Context)  {
    const vbiversCount = await userRepository.find({
        where: {
            role: UserRole.VBIVER
        }
    })
    let text = `🧞 Вбиверов: ${vbiversCount.length}`

    text += `<code>\n\n/admin vbiver {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`

    return ctx.editMessageCaption( {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Список', callback_data: 'admin vbiver list'}],
                [{text: 'Назад', callback_data: 'admin menu'}]
            ]
        }
    })
}