import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {getUsername} from "@/helpers/getUsername";
import {userRepository} from "@/database";
import {UserRole} from "@/database/models/user";
import console from "console";

const regex = /admin set proStatus (?<userId>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const userId = Number(match.groups.userId)

    const user = await userRepository.findOne({
        where: {
            id: userId
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

    user.isPro = (!user.isPro)
    await userRepository.save(user)

    if (user.isPro) {
        try {
            await ctx.api.sendMessage(user.tgId, `
⬆️ Тебя повысили до статуса PRO ⬆️

🌿 Твой процент выплат поднимается на 10% - вместо 60%, ты получаешь 70% 📈
🌐 Отдельные домены которые доступны только "PRO воркерам".
💬 Отдельный чат для настоящих коал "PRO".
📨 Отдельные шлюзы отправки email.
🫣 Тег "PRO" в чатах, при желании можем тебе его не ставить.
💰 PRO-воркерам выдается бюджет на расходники или аккаунты/номера по запросу.
🛠 Добавим по вашему запросу конкретную площадку под ворк, так же можем ее скрыть для вас.
        `, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "🐨 PRO ЧАТ", url: 'https://t.me/+45tu1EbZZ1QyN2My'}]
                    ]
                }
            })

        } catch (e) {console.log(e)}
    }

    return ctx.reply(
        `${await getUsername(user)} теперь${(user.isPro) ? '' : ' не'} PRO`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: `deleteThisMessage`}],
                ]
            }
        })
}