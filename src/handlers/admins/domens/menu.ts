import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {mentorsRepository} from "@/database";
import {getService, serviceList} from "@/helpers/getServices";
import console from "console";

const regex = /^admin domen menu$/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    let text = `<b>Выберите сервис</b>`

    const keyboard = new InlineKeyboard()

    for (const i in serviceList) {
        const service = serviceList[i]
        if (i === '2' || i === '4' || i === '6') {
            keyboard.row()
        }
        keyboard.text(`${service.name.toUpperCase()}`, `admin domen service ${service.name}`)
    }

    keyboard.row()
    keyboard.text(`Назад`, `admin menu`)

    return ctx.editMessageCaption( {
        caption: text,
        reply_markup: keyboard
    })
}