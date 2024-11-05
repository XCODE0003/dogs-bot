import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository, supportsRepository} from "@/database";

const regex = /admin mailing menu/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    let text = `<code>/admin mailing {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`

    return ctx.editMessageCaption( {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Назад', callback_data: 'admin menu'}]
            ]
        }
    })
}