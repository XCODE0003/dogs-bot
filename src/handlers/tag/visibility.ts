import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {userRepository} from "@/database";

export const composer = new Composer<Context>()
composer.callbackQuery('tag change visibility', handler)

async function handler(ctx: Context)  {
    ctx.user.visibilityTag = !ctx.user.visibilityTag

    await userRepository.save(ctx.user)
    return ctx.reply(`Теперь твой тег <b>${(ctx.user.visibilityTag) ? 'Виден другим' : 'НЕ виден другим'}</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}],
            ]
        }
    })
}