import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {mentorsRepository, profitRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";

export const composer = new Composer<Context>()
composer.command('mentors', callbackHandler)
composer.callbackQuery('mentors', callbackHandler)

async function callbackHandler(ctx: Context)  {
    if (ctx.user.mentor) {
        return ctx.editMessageCaption( {
            caption: `🧸 Твой наставник: ${await getUsername(ctx.user.mentor.user)} || ${ctx.user.mentor.percent}%`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🐾 Убрать наставника", callback_data: `mentors remove` }],
                    [{ text: "Назад", callback_data: `settings` }]
                ]
            }
        })
    }

    const mentors = await mentorsRepository.find({
        relations: {
            user: true
        },
        where: {
            active: true
        }
    })

    if (mentors.length <= 0) {
        return ctx.reply(`Наставников сейчас нет`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        })
    }

    for (const mentor of mentors) {
        let keyb = [
            [{ text: "Подать заявку", callback_data: `mentors set for user ${mentor.id}` }]
        ]
        if (mentor === mentors[mentors.length - 1]) {
            keyb.push([{ text: "Меню", callback_data: `menuNewMessage` }])
        }
        if (mentor.active) {
            await ctx.reply(`🧸 Наставник: ${await getUsername(mentor.user)} || ${mentor.percent}% || ${mentor.freedom} профитов\n\n${mentor.description}`, {
                reply_markup: {
                    inline_keyboard: keyb
                }
            })
        }
    }

    await ctx.deleteMessage()
}