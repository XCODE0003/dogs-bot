import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('create-link leboncoin fr', handler)

const keyboard = new InlineKeyboard()
    .text('Назад', 'leboncoin fr menu')

export async function handler(ctx: Context)  {
    return ctx.editMessageText(`
Для создания LEBONCOIN отправь эти данные одним сообщением:

<b>Страна (в формате двух букв: pt, us, es)
Название товара
Цена (с валютой)

Фото (сразу с текстом, одним сообщением)</b>
    `.replace('\n', ''), {
        reply_markup: keyboard
    })
}