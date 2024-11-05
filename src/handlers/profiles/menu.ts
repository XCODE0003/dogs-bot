import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('profiles menu', handler)

const keyboard = new InlineKeyboard()
    .text('🙊 Создать профиль', 'profiles create')
    .row()
    .text('📜 Список моих профилей', 'profiles list')
    .row()
    .text('Назад', 'workMenu2.0')

export async function handler(ctx: Context)  {
    return ctx.editMessageCaption({
        // caption: 'Профиль для создания обьявлений, тд тп...',
        reply_markup: keyboard
    })
}