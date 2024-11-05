import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository} from "@/database";

export const composer = new Composer<Context>()
composer.callbackQuery('leboncoin fr menu', handler)

async function handler(ctx: Context)  {
    const ads = await adsRepository.find({
        relations: { author: true },
        where: {
            delete: false,
            service: 'leboncoin',
            country: 'fr',
            author: {
                tgId: ctx.user.tgId
            }
        },
    })

    await ctx.editMessageCaption( {
        caption:`
<b>🙊 Количество обьявлений: <code>${ads.length}</code></b>
    `.replace('\n', ''),
        reply_markup: {
            inline_keyboard: [
                [{text: '🦾 Создать вручную', callback_data: 'ad manual creation leboncoin-fr'}],
                [{text: 'Назад', callback_data: 'workMenu2.0'}]
            ]
        }
    })

}