import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('workMenu2.0', handler)
composer.callbackQuery('no-auto-create-answer', callbackAnswer)
composer.command('workMenu', handler)

const keyboard = new InlineKeyboard()
    .text('Профили', 'profiles menu')
    .row()
    .text('🇩🇪 Германия', 'workMenu de')
    .text('🇫🇷 Франция', 'workMenu fr')
    .row()
    .text('🇮🇹 Италия', 'workMenu it')
    .text('🇪🇸 Испания', 'workMenu es')
    .row()
    .text('🇬🇧🇺🇸🇨🇦🇦🇺', 'workMenu us')
    .row()
    .text('Назад', 'menu')

export async function handler(ctx: Context)  {
    return ctx.editMessageCaption({
        caption: `
Да-да, тебе не нужно делать это лапками!
Просто кидай ссылку с площадки, которую заводишь и бот автоматически создат тебе ссылку для мохнатого 🦣
`.replace("\n",``),
        reply_markup: keyboard
    })
}

async function callbackAnswer(ctx: Context) {
    return ctx.answerCallbackQuery({
        show_alert: true,
        text: '⚠️ Ручное создание сейчас недоступно\nОтправь ссылку объявления в бота'
    })
}