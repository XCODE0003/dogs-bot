import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository} from "@/database";
import {getPictureMenu} from "@/helpers/getPictureMenu";

const regex = /admin mentors menu/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    let text = `🐲 Наставников в боте ${await mentorsRepository.count()}`

    text += `<code>\n\n/admin mentor {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`

    return ctx.editMessageCaption( {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Список активных менторов', callback_data: 'admin mentors list on'}],
                [{text: 'Список выкл менторов', callback_data: 'admin mentors list off'}],
                [{text: 'Назад', callback_data: 'admin menu'}]
            ]
        }
    })
}

export async function mentorsMenu(ctx: Context)  {
    let text = `🐲 Наставников в боте ${await mentorsRepository.count()}`

    text += `<code>\n\n/admin mentor {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`

    return ctx.replyWithPhoto( await getPictureMenu(ctx.user),{
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Список активных менторов', callback_data: 'admin mentors list on'}],
                [{text: 'Список выкл менторов', callback_data: 'admin mentors list off'}],
                [{text: 'Назад', callback_data: 'admin menu'}]
            ]
        }
    })
}