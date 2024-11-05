import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {getUsername} from "@/helpers/getUsername";
import {userRepository} from "@/database";
import {UserRole} from "@/database/models/user";

const regex = /admin kick (?<userId>\d+) (?<type>true|choice)/gmsi
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
            `Вы уверены что хотите кикнуть ${await getUsername(user,true,true)} ?`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Да', callback_data: `admin kick ${tgId} true`}],
                    [{text: 'Закрыть', callback_data: `deleteThisMessage`}],
                ]
            }
        })
    }

    if (type === 'true') {
        user.role = UserRole.RANDOM
        await userRepository.save(user)

        return ctx.editMessageText(
            `${await getUsername(user)} был кикнут.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: `deleteThisMessage`}],
                    ]
                }
            })
    }
}