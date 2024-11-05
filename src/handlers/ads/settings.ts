import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository} from "@/database";

export const composer = new Composer<Context>()
composer.callbackQuery(/^settings ad (?<id>\d+)/gmi, handler)

export async function handler(ctx: Context)  {
    const match = /^settings ad (?<id>\d+)/gmi.exec(ctx.callbackQuery.data)

    const ad = await adsRepository.findOne({
        relations: ['profile'],
        where: {
            id: Number(match.groups.id)
        }
    })

    if (!ad) return ctx.reply('ad undefined')

    const keyb = [
        [{text: "Сменить цену", callback_data: `settings ad amount ${ad.id}`}],
        [{text: "Сменить название", callback_data: `settings ad title ${ad.id}`}],
        [{text: "Сменить описание", callback_data: `settings ad description ${ad.id}`}],
        [{text: "Сменить изображение", callback_data: `settings ad img ${ad.id}`}],
    ]

    if (ad.profile) {
        keyb.push([{text: "Сменить профиль", callback_data: `settings ad profile ${ad.id}`}],)
    }

    keyb.push( [{text: "❌ Удалить", callback_data: `ad delete ${ad.id}`}])
    keyb.push( [{text: "Назад", callback_data: `ad ${ad.id}`}])

    return ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: keyb
        }
    })
}