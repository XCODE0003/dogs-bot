import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {getPictureMenu} from "@/helpers/getPictureMenu";

export const composer = new Composer<Context>()
composer.callbackQuery('vinted', handler)

const keyboard = new InlineKeyboard()
    .text('🇪🇸 Испания', 'vinted es menu')
    .row()
    .text('Назад', 'workMenu')

async function handler(ctx: Context)  {
    return ctx.editMessageCaption({
        caption: `<b>🍀 Чтобы создать ссылку, отправь ссылку на товар боту и он все сделает автоматически или нажми "Создать вручную", чтобы создать кастомное объявление.</b>`,
        reply_markup: keyboard
    })
}

export async function ebayMenu(ctx: Context) {
    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption: `
<b>⭐️ Ссылки VINTED создаются просто отправкой.
Отправь ссылку и бот сделает всё сам</b>
    `.replace('\n', ''),
        reply_markup: keyboard
    })
}