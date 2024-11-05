import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {lonelypupsRepository, profilesRepository, userRepository} from "@/database";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {Lonelypups} from "@/database/models/lonelypups";
import {privateLonelyPupsUserEmail, privateLonelyPupsUserForNewMessage} from "@/handlers/private/lonelypups/userEmails";

export const composer = new Composer<Context>()
composer.callbackQuery('private lonelypups set email', startScene)
async function startScene(ctx: Context) {
    const emails = await lonelypupsRepository.find({
        where: {
            author: String(ctx.user.tgId)
        }
    })

    if (emails.length > 4) {
        return ctx.answerCallbackQuery({
            show_alert: true,
            text: 'Максимум можно создать 4 почты'
        })
    }

    return ctx.scenes.enter('private lonelypups set email')
}

export const setLonelypupsEmail = new Scene<Context>('private lonelypups set email')



setLonelypupsEmail.always().callbackQuery('cancel lonelypupsemail', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
})

setLonelypupsEmail.do(async (ctx) => {
    const msg = await ctx.reply("🐾 Отправь свою почту для <b>PET TAXI</b>", {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel lonelypupsemail')
    })
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
    ctx.scene.resume()
})

setLonelypupsEmail.wait().hears(/(?<email>^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$)/g,async (ctx) => {

    const ttt = /(?<email>^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$)/g.exec(ctx.msg.text)
    const lonely = await lonelypupsRepository.findOne({
        where: {
            email: ttt.groups.email
        }
    })

    if (lonely) {
        if (lonely.author !== String(ctx.from.id)) {
            return ctx.reply(`Используется другим воркером`, {
                reply_markup:  new InlineKeyboard()
                    .text('Отмена', 'cancel lonelypupsemail')
            })
        }
        return ctx.reply(`Уже используется вами `, {
            reply_markup:  new InlineKeyboard()
                .text('Отмена', 'cancel lonelypupsemail')
        })
    }


    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.session.text = ttt.groups.email

    await ctx.reply(`🧢 <b>Цена доставки:</b>`, {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'cancel lonelypupsemail')
    })
    ctx.scene.resume()
})

setLonelypupsEmail.wait().hears(/(^\d+\.\d\d)|(^\d+)/g,async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    const userPrice = parseFloat(ctx.match[0])
    ctx.session.tgId = parseFloat(ctx.match[0])

    const lonelyEmail = new Lonelypups()
    lonelyEmail.email = ctx.session.text
    lonelyEmail.deliveryPrice = ctx.session.tgId
    lonelyEmail.author = String(ctx.from.id)

    await lonelypupsRepository.save(lonelyEmail)
    ctx.scene.exit()
    return privateLonelyPupsUserForNewMessage(ctx)
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