import {NextFunction} from 'grammy'

import {log} from '@/utils/logger'
import {Context} from "@/database/models/context";
import {UserRole} from "@/database/models/user";
import {getUsername} from "@/helpers/getUsername";
import {redis} from "@/utils/setupSession";

export async function considerationMiddleware(ctx: Context, next: NextFunction) {

    if ( ctx.from.id !== ctx.chat.id) return next()

    if (await redis.get(`cons-${ctx.from.id}`) === '1' && /start|vbiv|top|me/gmi.exec(ctx.msg.text) ) {
        return ctx.reply(`Нельзя вводить команды`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    if (await redis.get(`cons-${ctx.from.id}`) !== '1' && ctx.user.role === UserRole.RANDOM && !ctx.callbackQuery) {
                return ctx.reply(`
Подай заявку
<b>Не подается заявка? Напиши мне:</b> <a href="https://t.me/mightysequoia">mightysequoia</a>
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Подать заявку", callback_data: `apply`}]
                ]
            }
        })
    }

   return next()
}
