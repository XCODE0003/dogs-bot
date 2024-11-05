import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {notificationBot} from "@/utils/bot";

const regex = /^verify notificationbot/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    try {
        notificationBot.api.getChat(ctx.user.tgId)
            .then(() => {
                return ctx.editMessageText('🌱 Ты успешно запустили бота', {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Закрыть", callback_data: "deleteThisMessage"}]
                        ]
                    }
                })
            })
            .catch(() => {
                return ctx.answerCallbackQuery({
                    text: '⚠️ Ты не запустил бота',
                    show_alert: true
                })
            })
    } catch (e) {
        console.log(e)
        return ctx.answerCallbackQuery({
            text: '⚠️ Ты не запустил бота',
            show_alert: true
        })
    }

}