// @ts-nocheck

import {Composer} from "grammy";
import {Context} from "@/database/models/context";
import {supportsRepository, userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /^support change status (?<id>\d+)/gmi
composer.callbackQuery(regex, command)

async function command(ctx: Context) {
    const match = regex.exec(ctx.callbackQuery.data)
    const id = Number(match.groups.id)

    const support = await supportsRepository.findOne({
        where: {
            id
        }
    })

    if (!support) {
        return  ctx.reply('Support undefined', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    support.active = !support.active
    await supportsRepository.save(support)

    const studentList = await userRepository.find({
        relations: {supportUser: true},
        where: {
            supportUser: support
        }
    })

    for (const stud of studentList) {
        stud.supportUser = null
        await userRepository.save(stud)
    }

    return ctx.reply(`ТПшер был ${(support.active) ? 'Включен' : 'Выключен'}`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
}