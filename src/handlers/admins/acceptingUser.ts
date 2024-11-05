import {Context} from "@/database/models/context";
import {Composer, InputFile} from "grammy";
import {userRepository} from "@/database";
import {UserRole} from "@/database/models/user";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import moment from "moment/moment";

const regex = /admin (?<type>accept|decline) (?<userId>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const type = match.groups.type
    const tgId = Number(match.groups.userId)

    const user = await userRepository.findOne({
        where: {
            tgId
        }
    })

    if (!user) return ctx.reply("user undefined")

    if (type === 'accept') {
        user.role = UserRole.WORKER
        user.created = moment().toJSON()
        await userRepository.save(user)
        await ctx.api.sendPhoto(user.tgId, new InputFile('assets/photos/logo.jpg'),
            {
                caption: `<b>🌿 Заявка одобрена!</b>`,
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Меню', callback_data: 'menuNewMessage'}],
                    ]
                }

            })
    }

    if (type === 'decline') {
        user.role = UserRole.RANDOM
        await userRepository.save(user)

        await ctx.api.sendMessage(user.tgId,`<b>🦧 К сожалению, мы пока не готовы принять тебя в команду.</b>`)
    }

    return ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: [
                [{text: `${(type === 'accept') ? 'Принят' : 'Не принят'}`, callback_data: 'oaoaooa'}]
            ]
        }
    })
}