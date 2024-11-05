import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {profitRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /students remove (?<tgId>\d+)/gmi
composer.callbackQuery(regex, callbackHandler)

async function callbackHandler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const tgId = Number(match.groups.tgId)

    const user = await userRepository.findOne({
        where: {
            tgId
        }
    })

    if (!user || user.mentor.user !== ctx.user) {
        return ctx.reply(`User undefined OR Your not user mentor`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Dabro', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    user.mentor = null
    await userRepository.save(user)
    try {
        await ctx.deleteMessage()
    } catch (e) {}
    return ctx.reply(`Вы удалили пользователя с учеников`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'ОК', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
}