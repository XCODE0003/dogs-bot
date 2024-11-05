import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, InputFile} from "grammy";
import {adsRepository, domensRepository, profilesRepository} from "@/database";
import moment from "moment";
import {getPictureMenu} from "@/helpers/getPictureMenu";

export const composer = new Composer<Context>()
composer.callbackQuery(/^profile delete (\d+) (question|true)$/gmi, handler)

export async function handler(ctx: Context)  {
    const match = /^profile delete (\d+) (question|true)$/gmi.exec(ctx.callbackQuery.data)

    if (match[2] === 'question') {
        return ctx.reply(`
⚠️ <b>При удалении профиля, он слетит со всех обьявлений и мамонт увидит пустые значения в полях!</b>
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Удалить', callback_data: ctx.callbackQuery.data.replace('question', 'true')}],
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}],
                ]
            }
        })
    }

    const profile = await profilesRepository.findOne({
        where: {
            id: Number(match[1])
        }
    })

    if (!profile) return ctx.reply('profile undefined')

    const ads = await adsRepository.find({
        relations: {profile: true},
        where: {
            profile: {
                id: profile.id
            }
        }
    })

    for (const i in ads) {
        ads[i].profile = null
    }

    await adsRepository.save(ads)
    await profilesRepository.delete({id: profile.id})

    try {
        ctx.deleteMessage()
    }catch (e) {}
    return ctx.reply('✅ Профиль успешно удален', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
}