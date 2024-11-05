import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository, supportsRepository} from "@/database";
import {mentorsMenu} from "@/handlers/admins/mentors/menu";
import {getUsername} from "@/helpers/getUsername";
import {supportsMenu} from "@/handlers/admins/supports/menu";

const regex = /admin supports list (?<status>on|off)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    ctx.deleteMessage().then()
    const match = regex.exec(ctx.callbackQuery.data)
    const status = (match.groups.status === "on")

    const supports = await supportsRepository.find({relations: {user: true}})

    for (const support of supports) {
        if (support.active === status) {
            let text = `🐨 ТПшер: ${await getUsername(support.user)} || ${support.percent}%`
            text += `\n🌳 Активный: ${(support.active) ? 'Да' : 'Нет'}`
            text += `\n\n<code>/admin support ${support.user.tgId}</code>`
            await ctx.reply(text, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Подробнее', callback_data: `/admin support ${support.user.tgId}`}]
                    ]
                }
            })
            await new Promise(res => setTimeout(res, 1000 * 0.35));
        }
    }

    return supportsMenu(ctx)
}