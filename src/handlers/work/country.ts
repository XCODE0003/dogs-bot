import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {string} from "yaml/dist/schema/common/string";
import console from "console";

export const composer = new Composer<Context>()
composer.callbackQuery(/^workMenu\s+(?<country>\w+)/, handler)

const countryKeyb = {
    de: [
        ["🇩🇪 Kleinanzeigen", 'no-auto-create-answer'],
        ["🇩🇪 Vinted", 'no-auto-create-answer'],
        ["🇩🇪 Etsy", 'etsy de menu'],
        ["🇩🇪 Paysend", 'paysend menu']
    ],
    hu: [
        ["🇭🇺 Jofogas", 'no-auto-create-answer'],
    ],
    fr: [
        ["🇫🇷 Etsy", 'etsy fr menu'],
        ["🇫🇷 Leboncoin", 'leboncoin fr menu']
    ],
    es: [
        ["🇪🇸 Etsy", 'etsy es menu']
    ],
    us: [
        ["Etsy", 'etsy us menu'],
        ["Etsy VERIFY", 'etsy verify us menu']
    ],
    it: [
        ["🇮🇹 Etsy", 'etsy it menu']
    ]
}
const setKeyboard = (country: string): any => {
    const keyboard = new InlineKeyboard()
    const getKeybData = countryKeyb[country]

    for (const i in getKeybData) {
        const button = getKeybData[i]
        if (i === '2' || i === '4' || i === '6') {
            keyboard.row()
        }
        keyboard.text(button[0], button[1])
    }

    keyboard.row()
    keyboard.text("Назад", "workMenu2.0")
    return keyboard
}
export async function handler(ctx: Context)  {
    const keyboard = setKeyboard(ctx.match[1])

    return ctx.editMessageCaption({
        caption: `
Да-да, тебе не нужно делать это лапками!
Просто кидай ссылку с площадки, которую заводишь и бот автоматически создаcт тебе ссылку для мохнатого 🦣
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