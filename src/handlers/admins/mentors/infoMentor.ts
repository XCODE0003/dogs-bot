import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";

const regex = /\/admin\s+mentor\s+(?<tgid>\d+)/gmi
export const composer = new Composer<Context>()
composer.hears(regex, mentorInfo)
composer.callbackQuery(regex, mentorInfo)

export async function mentorInfo(ctx: Context)  {
    let match;
    if (ctx?.callbackQuery?.data) {
        await ctx.answerCallbackQuery()
        match = regex.exec(ctx.callbackQuery.data)
    } else  {
        match = regex.exec(ctx.match[0])
    }

    const id = match.groups.tgid

    const mentor = await mentorsRepository.findOne({
        relations: { user: true },
        where: {
            user: {
                tgId: Number(id)
            }
        }
    })

    if (!mentor) {
        return ctx.reply(`Наставника не существует`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: '🍀 Создать', callback_data: `admin mentor create ${id}`}],
                    [{text: 'Закрыть', callback_data: `deleteThisMessage`}]
                ]
            }
        })
    }

    const user = await userRepository.findOne({
        where: {
            tgId: Number(id)
        }
    })

    if (!user) {
        return ctx.reply(`Пользователя нет в базе данных, но есть в таблице наставников))) кодеру в лс напишите пж)`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: `deleteThisMessage`}]
                ]
            }
        })
    }

    return ctx.reply(`
🐨 Наставник: ${await getUsername(mentor.user,true)}

🌳 Процент: ${mentor.percent}%
🌳 Кол-во профитов: ${mentor.freedom}
🌳 Активный: ${(mentor.active) ? 'Да' : 'Нет'}

🌳 Описание: ${mentor.description}

    `, {
        reply_markup: {
            inline_keyboard: [
                [{text: `${(mentor.active) ? "🪫 Отключить" : "🔋 Включить"}`, callback_data: `mentor status ${mentor.id}`}],
                [{text: "🌿 Изменить описание", callback_data: `mentor change description ${mentor.id}`}],
                [{text: "🪵 Изменить процент", callback_data: `mentor change percent ${mentor.id}`}],
                [{text: "🐨 Изменить кол-во профитов", callback_data: `mentor change profitCount ${mentor.id}`}],
                [{text: "🗞 Закрыть", callback_data: `deleteThisMessage`}],
            ]
        }
    })
}