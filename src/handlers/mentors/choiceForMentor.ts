import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {mentorsRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";

export const composer = new Composer<Context>()
const regex = /mentors (?<choice>\w+) (?<userId>\d+) (?<mentorid>\d+)/
composer.callbackQuery(regex, callbackHandler)

async function callbackHandler(ctx: Context)  {
    const match = regex.exec(ctx.match[0])
    const userId = match.groups.userId
    const mentorId = match.groups.mentorid
    const choice = match.groups.choice

    if (choice === 'accept') {
        await ctx.deleteMessage()
        const user = await userRepository.findOne({
            where: {
                id: Number(userId)
            }
        })

        if (user.mentor) {
            return ctx.reply(`❗ У пользователя ${await getUsername(user,true,true)} уже есть наставник`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                    ]
                }
            })
        }

        const mentor = await mentorsRepository.findOne({
            where: { id: Number(mentorId) }
        })

        if (!mentor) {
            return ctx.reply(`Ментор не найден`)
        }

        user.mentor = mentor
        await userRepository.save(user)

        await ctx.reply(`🧸 Ты принял в состав ${await getUsername(user,true,true)}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        })

        return ctx.api.sendMessage(user.tgId, `🧸 Тебя принял в ученики ${await getUsername(ctx.user,true,true)}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        })
    }

    if (choice === 'cancel') {
        const user = await userRepository.findOne({
            where: {
                id: Number(userId)
            }
        })
        await ctx.deleteMessage()
        await ctx.reply(`🧸 Ты отклонил запрос ${await getUsername(user)}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        })

        return ctx.api.sendMessage(user.tgId, `🧸 Наставник ${await getUsername(ctx.user, true,true)} отклонил твой запрос`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        })
    }
}