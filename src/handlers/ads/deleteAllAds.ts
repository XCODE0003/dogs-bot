import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {adsRepository} from "@/database";

export const composer = new Composer<Context>()
composer.callbackQuery(/^ads delete all (question|true)/gmi, handler)

export async function handler(ctx: Context)  {
    const match = /^ads delete all (question|true)/gmi.exec(ctx.callbackQuery.data)

    if (match[1] === 'question') {
        return ctx.reply(`⚠️ <b>Ты действительно хочешь удалить все обьявления?</b>`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: '🐾 Удалить', callback_data: ctx.callbackQuery.data.replace('question', 'true')}],
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    const ads = await adsRepository.find({
        relations: ['author'],
        where: {
            delete: false,
            author: {
                tgId: ctx.user.tgId
            }
        }
    })

    for (const i in ads) {
        ads[i].delete = true
        ads[i].page = '0'
        ads[i].pageMobile = '0'
    }

    await adsRepository.save(ads)

    return ctx.reply(`🐾 Удалено ${ads.length}`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
}