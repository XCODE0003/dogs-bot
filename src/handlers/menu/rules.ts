import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('rules', callbackHandler)

function keyb() {
    return new InlineKeyboard()
        .text(`Назад`, 'useful')
}


const text = async (ctx: Context) => {
    return `🐨 Тут будут правила KOA`.replace('\n', '')
}

async function callbackHandler(ctx: Context)  {
    return ctx.editMessageCaption( {
        caption: await text(ctx),
        reply_markup: keyb()
    })
}