import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {userRepository} from "@/database";
import {UserRole} from "@/database/models/user";
import {getUsername} from "@/helpers/getUsername";
import {isSuperAdmin} from "@/helpers/isSuperAdmin";
import moment from "moment";

const regex = /admin set role (?<role>\w+) (?<id>\d+)/gmsi
const regexAdmin = /admin set admin (?<boolean>\w+) (?<id>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)
composer.callbackQuery(regexAdmin, handlerAdmin)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.update.callback_query.data)
    const id = Number(match.groups.id)
    const role = match.groups.role

    const user = await userRepository.findOne({
        where: {
            id: id
        }
    })

    console.log(user)

    if (!user) {
        return ctx.reply(`User undefined`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    if (role === 'vbiver') {
        user.role = UserRole.VBIVER
        user.vbivDate = moment().toJSON()
    }

    if (role === 'worker') {
        user.role = UserRole.WORKER
    }

    await userRepository.save(user)

    return ctx.reply(`User change role to ${user.role}`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
}

async function handlerAdmin (ctx: Context) {
    if (!isSuperAdmin(ctx)) return null

    const match = regexAdmin.exec(ctx.callbackQuery.data)
    const boolean = match.groups.boolean
    const id = Number(match.groups.id)

    const user = await userRepository.findOne({
        where: {
            id
        }
    })

    if (!user) return ctx.reply("User undefined",{
        reply_markup: {
            inline_keyboard: [
                [{text: "Закрыть", callback_data: "deleteThisMessage"}]
            ]
        }
    })

    user.admin = boolean === 'true';
    await userRepository.save(user)

    return ctx.reply(`<b>${await getUsername(user, true)}</b> ${(user.admin) ? 'теперь администратор' : 'снят с админки'}`,{
        reply_markup: {
            inline_keyboard: [
                [{text: "Закрыть", callback_data: "deleteThisMessage"}]
            ]
        }
    })
}