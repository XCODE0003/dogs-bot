import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository, supportsRepository} from "@/database";
import {getPictureMenu} from "@/helpers/getPictureMenu";

const regex = /admin supports menu/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    let text = `🐉 ТПшеров в боте ${await supportsRepository.count()}`

    text += `<code>\n\n/admin support {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`

    return ctx.editMessageCaption( {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Список активных ТПшеров', callback_data: 'admin supports list on'}],
                [{text: 'Список выкл ТПшеров', callback_data: 'admin supports list off'}],
                [{text: 'Назад', callback_data: 'admin menu'}]
            ]
        }
    })
}

export async function supportsMenu(ctx: Context)  {
    let text = `🐉 ТПшеров в боте ${await supportsRepository.count()}`

    text += `<code>\n\n/admin support {telegramId}</code>
<b>(Перешлите в чат сообщение чтобы получить telegram ID)</b>`

    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Список активных ТПшеров', callback_data: 'admin supports list on'}],
                [{text: 'Список выкл ТПшеров', callback_data: 'admin supports list off'}],
                [{text: 'Назад', callback_data: 'admin menu'}]
            ]
        }
    })
}