import {Composer} from "grammy";
import {Context} from "@/database/models/context";
import {mentorsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /mentor status (?<id>\d+)/gmi
composer.callbackQuery(regex, command)

async function command(ctx: Context) {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = Number(match.groups.id)

    const mentor = await mentorsRepository.findOne({
        where: {
            id
        }
    })

    if (!mentor) {
        return  ctx.reply('Mentor undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    mentor.active = !mentor.active
    await mentorsRepository.save(mentor)

    const studentList = await userRepository.find({
        relations: {mentor: true},
        where: {
            mentor
        }
    })

    for (const stud of studentList) {
        stud.mentor = null
        await userRepository.save(stud)
    }

    return ctx.reply(`Наставник был ${(mentor.active) ? 'Включен' : 'Выключен'}`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
}