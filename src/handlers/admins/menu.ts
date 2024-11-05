import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {getPictureMenu} from "@/helpers/getPictureMenu";

const regex = /admin menu/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)
composer.callbackQuery(/adminMenuWithPicture/, handlerWithPicture)

async function handler(ctx: Context)  {
    return ctx.editMessageCaption({
        caption: '🐨 Админ-панель',
        reply_markup: {
            inline_keyboard: [
                [{text: '🍀 ВБИВЕРЫ', callback_data: 'admin vbivers menu'}],
                [{text: '💌 Выдать SMS/EMAIL', callback_data: 'admin mailing menu'}],
                [{text: '🐲 Наставники', callback_data: 'admin mentors menu'},{text: '🐉 ТПшеры', callback_data: 'admin supports menu'}],
                [{text: '🔋 FULL WORK', callback_data: 'admin work start'}, {text: '🪫 STOP WORK', callback_data: 'admin work stop'}],
                [{text: '🤵 АФКшеры', callback_data: 'admin get afk user'}],
                [{text: '🗯 Кастомная рассылка', callback_data: 'admin custom notification'}],
                [{text: '🔗 Домены', callback_data: 'admin domen menu'},{text: '👑 [PRO] Домены', callback_data: 'admin domenpro menu'}],
                [{text: 'Назад', callback_data: 'menu'}]
            ]
        }
    })
}

async function handlerWithPicture(ctx: Context)  {
    return ctx.replyWithPhoto(await getPictureMenu(ctx.user),{
        caption: '🐨 Админ-панель',
        reply_markup: {
            inline_keyboard: [
                [{text: '🍀 ВБИВЕРЫ', callback_data: 'admin vbivers menu'}],
                [{text: '💌 Выдать SMS/EMAIL', callback_data: 'admin mailing menu'}],
                [{text: '🐲 Наставники', callback_data: 'admin mentors menu'},{text: '🐉 ТПшеры', callback_data: 'admin supports menu'}],
                [{text: '🔋 FULL WORK', callback_data: 'admin work start'}, {text: '🪫 STOP WORK', callback_data: 'admin work stop'}],
                [{text: '🗯 Кастомная рассылка', callback_data: 'admin custom notification'}],
                [{text: '🔗 Домены', callback_data: 'admin domen menu'},{text: '👑 [PRO] Домены', callback_data: 'admin domen menu'}],
                [{text: 'Назад', callback_data: 'menu'}]
            ]
        }
    })
}