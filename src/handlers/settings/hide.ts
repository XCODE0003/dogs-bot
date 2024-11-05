import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {userRepository} from "@/database";

export const composer = new Composer<Context>()
composer.callbackQuery('hide', settingsCallback)

async function settingsCallback(ctx: Context)  {
    ctx.user.hideUsername = !ctx.user.hideUsername
    await userRepository.save(ctx.user)

    return ctx.editMessageCaption({
        caption: `
Ты <b>${(ctx.user.hideUsername) ? 'скрыл себя' : 'раскрыл себя'}</b>

⚠️ Твой ник теперь<b>${(ctx.user.hideUsername) ? ' НЕ' : ''}</b> будет виден в общем чате и выплатах!
`,
        reply_markup: {
            inline_keyboard: [
                [{text: "Назад", callback_data: 'tag'}]
            ]
        }
    })
}