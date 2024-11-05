import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository} from "@/database";
import {mentorsMenu} from "@/handlers/admins/mentors/menu";
import {getUsername} from "@/helpers/getUsername";

const regex = /admin mentors list (?<status>on|off)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const status = (match.groups.status === "on")

    const mentors = await mentorsRepository.find({
        relations: {user: true},
        where: {
            active: status
        }
    })

    if (mentors.length === 0) {
        return ctx.reply(`${(status) ? 'Активных' : "Не активных"} наставников сейчас нет`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    for (const mentor of mentors) {
        let text = `🐨 Наставник: ${await getUsername(mentor.user)} || ${mentor.percent}%`
        text += `\n🌳 Активный: ${(mentor.active) ? 'Да' : 'Нет'}`
        text += `\n\n<code>/admin mentor ${mentor.user.tgId}</code>`
        await ctx.reply(text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Подробнее', callback_data: `/admin mentor ${mentor.user.tgId}`}]
                ]
            }
        })
        await new Promise(res => setTimeout(res, 1000 * 0.35));
    }

    return mentorsMenu(ctx)
}