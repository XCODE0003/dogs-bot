import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer, InlineKeyboard, InputFile} from "grammy";
import {logsRepository} from "@/database";
import {getPhoto} from "@/utils/download";
import {redirectMamont} from "@/handlers/logs/redirect";
import {getUsername} from "@/helpers/getUsername";

export const composer = new Composer<Context>()
const regex = /log\s+set\s+qrcode\s+(?<id>\d+)/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    await ctx.scenes.enter('log-set-qrcode')
}

export const setQrCodeInLogScene = new Scene<Context>('log-set-qrcode')

async function cancel (ctx) {
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    ctx.scene.exit()
}
setQrCodeInLogScene.always().callbackQuery('cancel log-set-qrcode', cancel)

setQrCodeInLogScene.always().callbackQuery(/qrcode redirect/, async (ctx) => {
    const regex = /log\s+redirect\s+(?<type>.+)\s+(?<order>\d+)\s+(?<msgDelete>true|false)/gmsi
    ctx.match = regex.exec(`log redirect qrcode ${ctx.session.logId} false`)
    await deleteAllMessages(ctx.session.deleteMessage,ctx)
    await redirectMamont(ctx)
    ctx.scene.exit()
})

setQrCodeInLogScene.do(async (ctx: Context) => {
    const match = regex.exec(ctx.match[0])
    const id = match.groups.id

    const log = await logsRepository.findOne({
        relations: ['ad', 'ad.author', 'ad.acceptedLog'],
        where: {
            id: Number(id)
        }
    })

    if (!log) {
        await ctx.reply('Лог не найден', {
            reply_markup:  new InlineKeyboard()
                .text('Закрыть', 'deleteThisMessage')
        })
        // @ts-ignore
        return ctx.scene.exit()
    }

    if (log.ad.acceptedLog.tgId !== ctx.user.tgId) {
        await ctx.reply(`
    Каким то образом лог оказался в ${await getUsername(log.ad.acceptedLog)}, как? Да хуй его знает, походу спиздил у тебя
    `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
        // @ts-ignore
        return ctx.scene.exit()
    }

    let res = undefined

    if (log.qrCode) {
        const photo = await getPhoto(log.qrCode)

        res = await ctx.replyWithPhoto(new InputFile(photo), {
            caption: `${(log.qrCodeText) ? log.qrCodeText : ''}\n\n\n<b>🎆 Отправь QR-CODE и текст:</b>`,
            reply_markup:  new InlineKeyboard()
                .text('Оставить текущее', `qrcode redirect`)
                .text('Отмена', 'cancel log-set-qrcode')
        })
    } else {
        res = await ctx.reply(`${(log.qrCodeText) ? log.qrCodeText : ''}\n\n\n<b>🎆 Отправь QR-CODE и текст:</b>`, {
            reply_markup:  new InlineKeyboard()
                .text('Отмена', 'cancel log-set-qrcode')
        })
    }

    ctx.session.deleteMessage = [res.message_id]
    ctx.session.logId = Number(id)
})

setQrCodeInLogScene.wait().on("message:photo",async (ctx) => {
    ctx.session.deleteMessage.push(ctx.message.message_id)
    const res = await ctx.getFile()

    if (!res || !ctx.session.logId) {
        await ctx.reply('Не найдено фото / id лога', {
            reply_markup:  new InlineKeyboard()
                .text('Закрыть', 'deleteThisMessage')
        })
        return ctx.scene.exit()
    }

    if (!ctx.msg.caption) {
        await ctx.reply('Не найден текст', {
            reply_markup:  new InlineKeyboard()
                .text('Закрыть', 'deleteThisMessage')
        })
        return cancel(ctx)
    }

    const log = await logsRepository.findOne({
        where: {
            id: ctx.session.logId
        }
    })

    if (!log) {
        await ctx.reply('Лог не найден в бд', {
            reply_markup:  new InlineKeyboard()
                .text('Закрыть', 'deleteThisMessage')
        })
        return cancel(ctx)
    }

    log.qrCode = res.file_path
    log.qrCodeText = ctx.msg.caption
    await logsRepository.save(log)

    const photo = await getPhoto(log.qrCode)

    const reply = await ctx.replyWithPhoto(new InputFile(photo), {
        caption: `<b>${log.qrCodeText}</b>`,
        reply_markup:  new InlineKeyboard()
            .text('Редирект', `qrcode redirect`)
            .text('Отмена', 'cancel log-set-qrcode')
    })

    ctx.session.deleteMessage.push(reply.message_id)
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