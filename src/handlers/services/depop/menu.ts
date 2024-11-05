import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository} from "@/database";

export const composer = new Composer<Context>()
composer.callbackQuery('depop de menu', handler)

async function handler(ctx: Context)  {
    const ads = await adsRepository.find({
        relations: { author: true },
        where: {
            delete: false,
            service: 'facebook',
            country: 'asd',
            author: {
                tgId: ctx.user.tgId
            }
        },
    })

    await ctx.editMessageCaption( {
        caption:`
<b>Количество обьявлений: <code>${ads.length}</code></b>

<b>⚠️ Ты можешь посмотреть только последние 20 обьявлений.</b>
    `.replace('\n', ''),
        reply_markup: {
            inline_keyboard: [
                [{text: '🏷 Список', callback_data: 'depop list'}],
                // [{text: '🦾 Создать вручную', callback_data: 'ad manual creation ebay-de'}],
                [{text: 'Удалить все', callback_data: 'ads delete all question'}],
                [{text: 'Назад', callback_data: 'depop'}]
            ]
        }
    })

}