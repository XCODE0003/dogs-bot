import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import {UsernameListForAdmin} from "@/utils/usernames";

const regex = /\/id (?<name>\w+|@\w+)/gmsi
export const composer = new Composer<Context>()
composer.hears(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.match[0])
    let name = match.groups.name

    if (name[0] === '@') name = name.slice(1,name.length)

    const dataObject = await UsernameListForAdmin.getUsernameById(name)
    if (!dataObject) {
        return ctx.reply(`Username undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Закрыть", callback_data: "deleteThisMessage"}]
                ]
            }
        })
    }

    const user = await userRepository.findOne({
        where: {
            tgId: dataObject.telegramId
        }
    })
    await ctx.deleteMessage()
    if (!user) return ctx.reply("User undefined",{
        reply_markup: {
            inline_keyboard: [
                [{text: "Закрыть", callback_data: "deleteThisMessage"}]
            ]
        }
    })

    let text = `
🌳 ${await getUsername(user, true)} [<code>${user.tgId}</code> | @${name}]`
    return ctx.reply(text,{
        reply_markup: {
            inline_keyboard: [
                [{text: "🐨 Меню пользователя", callback_data: `admin user ${user.tgId}`}],
                [{text: "Закрыть", callback_data: "deleteThisMessage"}]
            ]
        }
    })
}