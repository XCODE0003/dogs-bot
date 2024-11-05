import {NextFunction} from 'grammy'
import {Context} from '@/database/models/context'
import {UserRole} from '@/database/models/user'
import {config} from "@/utils/config";
import {userRepository} from "@/database";

export async function privateMiddleware(ctx: Context, next: NextFunction) {
    if (!ctx.callbackQuery) {
        if (ctx.chat.id !== ctx.from.id) return
    }

    if (ctx?.message?.text === '/kickNeActiveUsers') {
        const users = await userRepository.find()

        for (const user of users) {
            if ( user.role === UserRole.RANDOM
                || user.role === UserRole.CONSIDERATION
                || user.role === UserRole.BAN
                || user.role === UserRole.NOTACCEPT) {
                try {
                    const res = await ctx.api.kickChatMember(config.chats.chat, user.tgId)
                    console.log(res)
                }catch (e) {
                    console.log(e)
                }

            }
        }
    }

    if (!ctx.from.username) return ctx.reply('Установи username!')

    if (ctx.user.role === UserRole.CONSIDERATION && ctx?.callbackQuery?.data !== 'deleteThisMessage') {
        return ctx.reply(`⏳ Заявка на рассмотрении, пожалуйста ожидай.`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    if (ctx.user.role === UserRole.NOTACCEPT) {
        return ctx.reply(`<b>🦧 К сожалению мы пока не готовы принять тебя в команду.</b>`)
    }

    if (ctx.user.role === UserRole.BAN) {
        return ctx.reply(`😐`)
    }

    return next()

}
