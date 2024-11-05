import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('communication', callbackHandler)

function keyb() {
    return new InlineKeyboard()
        .text(`Назад`, 'useful')
}


const text = async (ctx: Context) => {
    return `🐨 <a href="tg://user?id=5438664353">KOA</a> <b>или</b> <a href="tg://user?id=5604097517">Ricco</a>\n<b>🖥 Тех. проблемы: </b><a href="tg://user?id=5685044944">Йупи</a>`.replace('\n', '')
}

async function callbackHandler(ctx: Context)  {
    return ctx.editMessageCaption( {
        caption: await text(ctx),
        reply_markup: keyb()
    })
}