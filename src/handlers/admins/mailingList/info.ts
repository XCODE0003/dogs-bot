import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";

const regex = /\/admin\s+mailing\s+(?<tgid>\d+)/gmi
export const composer = new Composer<Context>()
composer.hears(regex, smsInfo)
composer.callbackQuery(regex, smsInfo)

export async function smsInfo(ctx: Context)  {
    let match;
    if (ctx?.callbackQuery?.data) {
        ctx.answerCallbackQuery()
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
🐨 Воркер: ${await getUsername(user,true)}

📲 SMS: ${user.sms}
💌 EMAIL: ${user.email}
    `, {
        reply_markup: {
            inline_keyboard: [
                [{text: "➕ Добавить SMS", callback_data: `sms issue ${user.tgId}`}],
                [{text: "➕ Добавить EMAIL", callback_data: `email issue ${user.tgId}`}],
                [{text: "Закрыть", callback_data: `deleteThisMessage`}],
            ]
        }
    })
}