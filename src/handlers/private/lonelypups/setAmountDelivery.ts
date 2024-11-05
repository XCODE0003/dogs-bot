import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard} from "grammy";
import {lonelypupsRepository, profilesRepository, userRepository} from "@/database";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import {Lonelypups} from "@/database/models/lonelypups";

const regex = /private lonelypups set amount (?<id>\d+)/g
export const composer = new Composer<Context>()
composer.callbackQuery(regex, startScene)
async function startScene(ctx: Context) {
    const id = Number(ctx.match[1])

    return ctx.scenes.enter('private lonelypups set amount')
}

export const setLonelypupsAmount = new Scene<Context>('private lonelypups set amount')



setLonelypupsAmount.always().callbackQuery('private lonelypupsamount', async (ctx) => {
    await deleteAllMessages(ctx.session.deleteMessage, ctx)
    ctx.scene.exit()
})

setLonelypupsAmount.do(async (ctx: Context) => {
    ctx.session.logId = Number(regex.exec(ctx.callbackQuery.data).groups.id)

    const msg = await ctx.reply(`🧢 <b>Новая цена доставки:</b>`, {
        reply_markup:  new InlineKeyboard()
            .text('Отмена', 'private lonelypupsamount')
    })
    ctx.session.deleteMessage = []
    ctx.session.deleteMessage.push(msg.message_id)
})

setLonelypupsAmount.wait().hears(/(^\d+\.\d\d)|(^\d+)/g,async (ctx) => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    const userPrice = parseFloat(ctx.match[0])
    ctx.session.tgId = parseFloat(ctx.match[0])

    const lonelyEmail = await lonelypupsRepository.findOne({
        where: {
            id: ctx.session.logId
        }
    })

    lonelyEmail.deliveryPrice = ctx.session.tgId
    await lonelypupsRepository.save(lonelyEmail)

    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
    return  ctx.reply(`✅ Цена успешно обновлена!`, {
        reply_markup:  new InlineKeyboard()
            .text('Закрыть', `deleteThisMessage`)

    })
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