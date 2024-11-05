import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository, profitRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import {mentorsMenu} from "@/handlers/mentors/menu";

export const composer = new Composer<Context>()
composer.callbackQuery('mentors students list', callbackHandler)

async function callbackHandler(ctx: Context)  {
    const students = await userRepository.find({
        relations: ['mentor', 'mentor.user'],
        where: {
            mentor: {
                user: {
                    tgId: ctx.user.tgId
                }
            }
        }
    })

    if (students.length === 0) {
        return ctx.reply('У тебя нет учеников', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    for (const stud of students) {
        const profitThisStud = await profitRepository.find({
            relations: ['mentor', 'mentor.user', 'worker'],
            where: {
                worker: {
                    tgId: stud.tgId
                },
                mentor: {
                    user: {
                        tgId: ctx.user.tgId
                    }
                }
            }
        })

        let income = 0

        for (const profit of profitThisStud) {
            income += profit.value
        }
        let keyb = [
            [{text: 'Убрать из учеников', callback_data: `mentors students delete ${stud.id}`}],
        ]

        if (students[students.length - 1].id === stud.id) {
            keyb.push(
                [{text: 'Меню наставника', callback_data: `mentors menuWithPhoto`}],
            )
        }
        await ctx.reply(`Ученик: ${await getUsername(stud, true,true)}\nЗаработал: ${income} USD`, {
            reply_markup: {
                inline_keyboard: keyb
            }
        })

        await new Promise((resolve) => setTimeout(resolve, 1000 * 0.25))
    }
}