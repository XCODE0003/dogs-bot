import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import {UserRole} from "@/database/models/user";
import moment from "moment";

const regex = /\/admin\s+vbiver\s+(?<tgid>\d+)/gmi
export const composer = new Composer<Context>()
composer.hears(regex, smsInfo)
composer.callbackQuery(regex, smsInfo)

export async function smsInfo(ctx: Context)  {
    let match;
    if (ctx?.callbackQuery?.data) {
        await ctx.answerCallbackQuery()
        match = regex.exec(ctx.callbackQuery.data)
    } else  {
        match = regex.exec(ctx.match[0])
    }

    const id = Number(match.groups.tgid)

    const user = await userRepository.findOne({
        where: {
            tgId: Number(id)
        }
    })

    if (user.role !== UserRole.VBIVER) {
        return ctx.reply(`Пользователь ${await getUsername(user)} не вбивер`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: '🐨 Сделать вбивером', callback_data: `admin set role vbiver ${user.id}`}],
                    [{text: "Закрыть", callback_data: `deleteThisMessage`}],
                ]
            }
        })
    }

    if (!user) {
        return ctx.reply(`Пользователя нет в базе данных, но есть в таблице вбиверов))) кодеру в лс напишите пж)`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: `deleteThisMessage`}]
                ]
            }
        })
    }

    return ctx.reply(`
🐨 Пользователь: ${await getUsername(user,true)}

⌚️ На вбиве с: <code>${moment(new Date(user.vbivDate)).format('DD.MM.YYYY в hh:mm')}</code>
    `, {
        reply_markup: {
            inline_keyboard: [
                [{text: "🐨 Сделать воркером", callback_data: `admin set role worker ${user.id}`}],
                [{text: "Закрыть", callback_data: `deleteThisMessage`}],
            ]
        }
    })
}