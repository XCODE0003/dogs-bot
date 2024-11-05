import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('useful url list for user', callbackHandler)

function keyb(isPro: boolean) {
    let keyb = new InlineKeyboard()
        .url(`⚠️ Канал уведомлений`, 'https://t.me/koa_notifications_robot')
        .row()
        .url(`❕ Выплаты`, 'https://t.me/+I3-jEK5WofEzMGJi')
        .url(`💬 Чат`, 'https://t.me/+h4cM0O9D89g5YzEy')

    if (isPro) {
        keyb
            .row()
            .url(`🐨 Чат [PRO]`, 'https://t.me/+45tu1EbZZ1QyN2My')
    }

    keyb
        .row()
        .text(`Назад`, 'useful')

    return keyb
}

async function callbackHandler(ctx: Context)  {
    return ctx.editMessageCaption( {
        // caption: await text(ctx),
        reply_markup: keyb(ctx.user.isPro)
    })
}