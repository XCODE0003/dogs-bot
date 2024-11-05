import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {userRepository} from "@/database";

export const composer = new Composer<Context>()
composer.callbackQuery('photoMenu', settingsCallback)

async function settingsCallback(ctx: Context)  {

    return ctx.editMessageCaption({
        caption: ``,
        reply_markup: {
            inline_keyboard: [
                [{text: "Установить свое фото", callback_data: 'setPhotoMenu'}],
                [{text: "Поставить наше фото", callback_data: 'setPhotoMenu default'}],
                [{text: "Назад", callback_data: 'settings'}]
            ]
        }
    })
}