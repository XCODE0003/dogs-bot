import {NextFunction} from 'grammy'

import {userRepository} from '@/database'
import {log} from '@/utils/logger'
import {Context} from '@/database/models/context'
import {User, UserRole} from '@/database/models/user'
import {UsernameListForAdmin, Usernames} from "@/utils/usernames";
import console from "console";

export async function userMiddleware(ctx: Context, next: NextFunction) {
    // for (const photo of ctx.message.photo) {
    //     console.log(photo)
    // }
    if (!ctx?.from?.username) {
        if (ctx.from.id !== ctx.chat.id) return null
        const res = await ctx.reply('Установите юзернейм!')
        setTimeout(async () => {
            try {
                await ctx.api.deleteMessage(ctx.chat.id, res?.message_id)
            } catch (e) {}
        }, 1000 * 60)
        console.log(ctx.from.id, ' Не установлен юзернейм')
    }

    const usernames = new Usernames()
    log.debug(`Handle user middleware | ${ctx.from.id} | ${ctx.from.username} | ${await usernames.checkUsername(ctx.from.username,ctx.from.id)}`)
    const id = ctx?.from?.id

    let user: User
    user = await userRepository.findOne({
        where: {
            tgId: ctx.from.id,
        },
        relations: ['mentor', 'mentor.user', 'lastProfit']
    })

    if (!user) {
        user = new User()
        user.tgId = id
        user.tag = "tag"
        user.role = UserRole.RANDOM
        user.email = 1
        user.sms = 1
        await userRepository.save(user)
    }

    if (ctx.from.first_name !== user.firstName) {
        user.firstName = ctx.from.first_name
        await userRepository.save(user)
    }
    ctx.user = user
    return next()
}
