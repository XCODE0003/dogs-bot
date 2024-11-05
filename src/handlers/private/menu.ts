import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('private menu lonelypups', handler)

const keyboard = new InlineKeyboard()
    .text('📦 Мои почты', 'private lonelypups user emails')
    .row()
    .text('Назад', 'menu') 
    // .text('💌 Отправить письмо', 'private lonelypups send email')
    // .row()

export async function handler(ctx: Context)  {
    return ctx.editMessageCaption({
        // caption: 'Профиль для создания обьявлений, тд тп...',
        reply_markup: keyboard
    })
}