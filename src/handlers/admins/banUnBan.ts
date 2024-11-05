import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {getUsername} from "@/helpers/getUsername";
import {userRepository} from "@/database";
import {UserRole} from "@/database/models/user";

const regex = /admin ban (?<userId>\d+) (?<type>true|false|choice)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const type = match.groups.type
    const tgId = Number(match.groups.userId)

    const user = await userRepository.findOne({
        where: {
            tgId 
        }
    })

    if (!user) {
        return ctx.reply(`User undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: `deleteThisMessage`}]
                ]
            }
        })
    }

    if (type === 'choice'){
        return ctx.reply(
            `Вы уверены что хотите ${(user.role === UserRole.BAN) ? 'разбанить': 'забанить'} ${await getUsername(user,true,true)} ?`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Да', callback_data: `admin ban ${tgId} ${(user.role === UserRole.BAN) ? 'false' : 'true'}`}],
                    [{text: 'Закрыть', callback_data: `deleteThisMessage`}],
                ]
            }
        })
    }

    if (type === 'true') {
        user.role = UserRole.BAN
        await userRepository.save(user)

        return ctx.editMessageText(
            `${await getUsername(user)} был забанен.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: `deleteThisMessage`}],
                    ]
                }
            })
    }

    if (type === 'false') {
        user.role = UserRole.WORKER
        await userRepository.save(user)

        return ctx.editMessageText(
            `${await getUsername(user)} был разбанен.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: `deleteThisMessage`}],
                    ]
                }
            })
    }

}