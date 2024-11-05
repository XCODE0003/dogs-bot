import {Composer} from "grammy";
import {Context} from "../../database/models/context";

export const composer = new Composer<Context>()
composer.callbackQuery('support', handler)

async function handler(ctx: Context)  {
    let text = undefined

    if (ctx.user.supportTeam) {
        text = `🌚 Установлена наша ТП`
    } else {
        text = `🎯 Выбрано свое ТП\n\n<code>${(ctx.user.supportCode) ? ctx.user.supportCode : 'Smartsupp код не установлен'}</code>`
    }

    return ctx.editMessageCaption( {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: "🌚 Включить наше ТП", callback_data: `support set our` }],
                [{ text: "🎯 Установить свою ТП", callback_data: `support set user` }],
                [{ text: "Назад", callback_data: `menu` }],
            ]
        }
    })
}
