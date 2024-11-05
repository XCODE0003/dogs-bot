import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, InputFile} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import moment from "moment";
import {getPictureMenu} from "@/helpers/getPictureMenu";

export const composer = new Composer<Context>()
composer.callbackQuery(/^ad delete (?<id>\d+)/gmi, handler)

export async function handler(ctx: Context)  {

    const match = /^ad delete (?<id>\d+)/gmi.exec(ctx.callbackQuery.data)

    const ad = await adsRepository.findOne({
        where: {
            id: Number(match.groups.id)
        }
    })

    if (!ad) return ctx.reply('ad undefined')
    ad.page = '0'
    ad.pageMobile = '0'
    ad.delete = true

    await adsRepository.save(ad)
    // try {
    //     ctx.deleteMessage()
    // }catch (e) {}
    return ctx.reply('✅ Обьявление успешно удалено', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
}