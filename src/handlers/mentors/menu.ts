import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {mentorsRepository, profitRepository, userRepository} from "@/database";
import {User} from "@/database/models/user";
import {getPictureMenu} from "@/helpers/getPictureMenu";

export const composer = new Composer<Context>()
composer.callbackQuery('mentors menu', mentorsCallbackMenu)
composer.callbackQuery('mentors menuWithPhoto', mentorsMenu)
export async function mentorsMenu(ctx: Context)  {

    const mentor = await isMentor(ctx.user)

    if (mentor === undefined) {
        return ctx.reply(`Вы не наставник`,{
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        })
    }
    const data = await getData(mentor.id)
    let text = ''
    text += `\n\nВсего в учениках: ${data.childrenCount}`
    text += `\nЗаработано с учеников: ${data.profitCount} USD`

    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: "Список учеников", callback_data: `mentors students list` }],
                [{ text: "Назад", callback_data: `settings` }],
            ]
        }
    })
}


export async function mentorsCallbackMenu(ctx: Context)  {
    const mentor = await isMentor(ctx.user)
    if (mentor === undefined) {
        return ctx.reply(`Вы не наставник`,{
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        })
    }
    const data = await getData(mentor.id)
    let text = ''
    text += `\n\nВсего в учениках: ${data.childrenCount}`
    text += `\nЗаработано с учеников: ${data.profitCount} USD`

    return ctx.editMessageCaption({
        caption: text,
        reply_markup: {
            inline_keyboard: [
                [{ text: "Список учеников", callback_data: `mentors students list` }],
                [{ text: "Назад", callback_data: `settings` }],
            ]
        }
    })
}

async function getData(mentorId: number) {
    const users = await userRepository.find({
        relations: {
            mentor: true
        },
        where: {
            mentor: {
                id: mentorId
            }
        }
    })

    let childrenCount = 0
    for (const user of users) {
        childrenCount++
    }

    const profits = await profitRepository.find({
        relations: {
            mentor: true
        },
        where: {
            mentor: {
                id: mentorId
            }
        }
    })

    let profitCount = 0
    for (const profit of profits) {
        profitCount += Number(profit.mentorValue)
    }

    return {
        profitCount,
        childrenCount
    }
}

async function isMentor(user: User) {
    return await mentorsRepository.findOne({
        relations:
            {user: true},
        where: {
            user: {
                tgId: user.tgId
            }
        }
    })
}