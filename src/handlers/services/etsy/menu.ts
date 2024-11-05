import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository} from "@/database";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";

export const composer = new Composer<Context>()
composer.callbackQuery(/etsy (?<country>\w+) menu/, handler)

async function handler(ctx: Context)  {
    const ads = await adsRepository.find({
        relations: { author: true },
        where: {
            delete: false,
            service: 'etsy',
            country: ctx.match[1],
            author: {
                tgId: ctx.user.tgId
            }
        },
    })

    await ctx.editMessageCaption( {
        caption:`
<b>${getFlagEmoji(ctx.match[1])} Количество обьявлений: <code>${ads.length}</code></b>
    `.replace('\n', ''),
        reply_markup: {
            inline_keyboard: [
                [{text: '🦾 Создать вручную', callback_data: 'ad manual creation etsy ' + ctx.match[1]}],
                [{text: 'Назад', callback_data: 'workMenu2.0'}]
            ]
        }
    })

}