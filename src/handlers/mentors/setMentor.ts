import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import {redis} from "@/utils/setupSession";
import moment from "moment";

export const composer = new Composer<Context>()
const regex = /mentors set for user (?<id>\d+)/
composer.callbackQuery(regex, callbackHandler)

async function callbackHandler(ctx: Context)  {
    const match = regex.exec(ctx.match[0])
    const mentorId = match.groups.id

    let timeout = await redis.get(`${ctx.from.id}-mentor-timeout`)

    if (timeout) {
        let minutes = (Date.now() - Number(timeout))/60000;       //86400000 - ms в дне
        minutes = Math.round(minutes)

        if (minutes < 59) {
            return ctx.reply(`♻️ Ты уже подал заявку одному из менторов, подожди 1 час`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                    ]
                }
            })
        }
    }


    if (ctx.user.mentor) {
        return ctx.reply(`❗️ У тебя уже есть наставник`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        })
    }

    const mentor = await mentorsRepository.findOne({
        where: { id: Number(mentorId) },
        relations: { user: true }
    })

    if (!mentor) {
        return ctx.reply(`❗️ Ментор не найден`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        })
    }
    redis.set(`${ctx.from.id}-mentor-timeout`, Date.now())
    redis.save()
    await ctx.api.sendMessage(mentor.user.tgId, `🧸 ${await getUsername(ctx.user)} хочет к тебе в ученики!`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🪴 Принять", callback_data: `mentors accept ${ctx.user.id} ${mentor.id}` }],
                [{ text: "🐾 Отклонить", callback_data: `mentors cancel ${ctx.user.id} ${mentor.id}` }]
            ]
        }
    })

    return ctx.reply('✅ Заявка на ТП отправлена!\nОжидай решения.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
            ]
        }
    })
}