import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InputFile} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {userRepository} from "@/database";
import {config} from "@/utils/config";
import {stickerList} from "@/utils/stickerList";
import {UserRole} from "@/database/models/user";

export const composer = new Composer<Context>()
const regex = /admin custom notification/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    return ctx.scenes.enter('custom-notification')
}

export const scene = new Scene<Context>('custom-notification')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}

scene.always().callbackQuery('cancel custom-notification', cancel)

scene.do(async (ctx) => {
    ctx.session.customNotification = {text: undefined, buttons: undefined, photo: undefined}
    ctx.session.deleteMessage = []
    ctx.session.customNotification.text = '📢 Внимание, важное сообщение ❗️\n' +
        '➖➖➖➖➖➖➖➖➖➖➖➖\n'

    const response = await ctx.reply(`<b>Напишите текст (можно прикрепить фото) для рассылки:</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel custom-notification'}]
            ]
        }
    })
    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

scene.wait().on('message', async ctx => {
    ctx.session.deleteMessage.push(ctx.msg.message_id)

    if (ctx.msg?.text) ctx.session.customNotification.text += ctx.msg.text
    if (ctx.msg?.caption) ctx.session.customNotification.text += ctx.msg.caption
    if (ctx.msg?.photo) ctx.session.customNotification.photo = ctx.msg.photo[ctx.msg.photo.length - 1].file_id

    ctx.scene.resume()
})

scene.do(async ctx => {
    const text = `${ctx.session.customNotification.text}`
    const btn = {
        inline_keyboard: [
            [{text: 'Начать рассылку', callback_data: 'start notification'}],
            [{text: 'Отмена', callback_data: 'cancel custom-notification'}]
        ]
    }
    let response = undefined
    if (ctx.session.customNotification.photo) {
        response = await ctx.replyWithPhoto(ctx.session.customNotification.photo, {
            caption: text,
            reply_markup: btn
        })
    } else {
        response = await ctx.reply(text, {
            reply_markup: btn
        })
    }

    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

scene.wait().callbackQuery('start notification', async ctx => {
    const users = await userRepository.find()
    let response = undefined

    response = await ctx.reply(`Начинаю рассылку...`)
    ctx.session.deleteMessage.push(response.message_id)
    const result = {
        yep: 0,
        nope: []
    }
    const reply_markup = {
        inline_keyboard: [
            [{text: "Меню", callback_data: "menuWithPicture"}]
        ]
    }
    for (const user of users) {
        try {
            if (user.role === UserRole.VBIVER || user.role === UserRole.WORKER) {
                await ctx.api.sendSticker(user.tgId, stickerList.alert)
                if (ctx.session.customNotification.photo) await ctx.api.sendPhoto(user.tgId, ctx.session.customNotification.photo, {caption: ctx.session.customNotification.text, reply_markup})
                else await ctx.api.sendMessage(user.tgId, ctx.session.customNotification.text, {reply_markup})
                result.yep++
            }
        } catch (e) {
            result.nope.push({id: user.tgId,text: e.toString()})
        }
        await new Promise(res => setTimeout(res, 1000 * 0.35));
    }

    await ctx.api.sendSticker(config.chats.chat, stickerList.alert)
    if (ctx.session.customNotification.photo) await ctx.api.sendPhoto(config.chats.chat, ctx.session.customNotification.photo, {caption: ctx.session.customNotification.text})
    else await ctx.api.sendMessage(config.chats.chat, ctx.session.customNotification.text)

    let text = 'INFO'
    for (const one of result.nope) {
        text += `\n\nid: ${one.id}\nproblem: ${one.text}`
    }

    await ctx.replyWithDocument(new InputFile(Buffer.from(text, 'utf-8'), 'result.txt'), {

        caption: `Отправлено юзерам: ${result.yep}\n${result.nope.length} с ошибкой (чек файл)`,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
            ]
        }
    })
    return cancel(ctx)
})

// scene.wait().on('message:text', async ctx => {
//     try {
//         ctx.session.customNotification.buttons = JSON.parse(ctx.m)
//     } catch (e) {
//
//     }
//     ctx.session.deleteMessage.push(ctx.msg.message_id)
//     ctx.scene.resume()
// })
//
// scene.label("skipBtn")
