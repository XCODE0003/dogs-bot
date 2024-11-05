import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {Composer} from "grammy";
import {deleteAllMessages} from "@/helpers/deleteAllMessages";
import {UserRole} from "@/database/models/user";
import {redis} from "@/utils/setupSession";
import {config} from "@/utils/config";
import {userRepository} from "@/database";

export const composer = new Composer<Context>()
const regex = /apply/gmi
composer.callbackQuery(regex, startScene)

async function startScene(ctx: Context) {
    await ctx.deleteMessage()
    return ctx.scenes.enter('apply')
}

export const scene = new Scene<Context>('apply')

async function cancel (ctx) {
    await deleteAllMessages (ctx.session.deleteMessage,ctx)
    redis.set(`cons-${ctx.from.id}`, '0')
    redis.save()
    try {
        ctx.scene.exit()
    } catch (e) {}
    return ctx.reply(`<b>Нажми на кнопку.</b>
<b>Контакт на случай проблем с подачей заявки</b> @scarllet_dev
`, {
        reply_markup: {
            inline_keyboard: [
                [{text: '♻️', callback_data: 'apply'}]
            ]
        }
    })
}
async function cancel2 (ctx) {
    await deleteAllMessages (ctx.session.deleteMessage,ctx)
    redis.set(`cons-${ctx.from.id}`, '0')
    redis.save()
    try {
        ctx.scene.exit()
    } catch (e) {}
}

scene.always().callbackQuery('cancel apply', cancel)

scene.do(async (ctx) => {
    redis.set(`cons-${ctx.from.id}`, '1')
    redis.save()

    ctx.session.deleteMessage = []
    ctx.session.text = `<b>Новая заявка</b>\n\n <b>User:</b> @${ctx.from?.username} [${ctx.from.id}]`

    if (ctx.user.role !== UserRole.RANDOM) {
        return ctx.reply(`😔 Тебе уже нельзя подать заявку`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }

    const response = await ctx.reply(`
От кого узнал о нас (укажи тг)
`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel apply'}]
            ]
        }
    })


    ctx.session.deleteMessage.push(response.message_id)
    ctx.scene.resume()
})

scene.wait().on('message', async ctx => {
    ctx.session.text += `\n\n1. ${ctx.msg.text}`

    const response = await ctx.reply(`
Где раньше воркал?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel apply'}]
            ]
        }
    })

    ctx.session.deleteMessage.push(response.message_id)
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.scene.resume()
})

scene.wait().on('message:text', async ctx => {
    ctx.session.text += `\n2. ${ctx.msg.text}`

    const response = await ctx.reply(`
Почему ушел из предыдущей команды?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Отмена', callback_data: 'cancel apply'}]
            ]
        }
    })

    ctx.session.deleteMessage.push(response.message_id)
    ctx.session.deleteMessage.push(ctx.msg.message_id)
    ctx.scene.resume()
})

scene.wait().on('message:text', async ctx => {
    ctx.session.text += `\n3. ${ctx.msg.text}`

    await ctx.api.sendMessage(config.chats.applications, ctx.session.text, {
        reply_markup: {
            inline_keyboard: [
                [{text: '🪴 Принять', callback_data: `admin accept ${ctx.from.id}`}],
                [{text: '🐾 Отклонить', callback_data: `admin decline ${ctx.from.id}`}]
            ]
        }
    })
        .then(async res => {
            ctx.user.role = UserRole.CONSIDERATION
            await userRepository.save(ctx.user)
            redis.set(`cons-${ctx.from.id}`, '0')
            redis.save()
            await ctx.reply(`
<b>Заявка подана, ожидай проверку!</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                    ]
                }
            })

            ctx.session.deleteMessage.push(ctx.msg.message_id)
            return cancel2(ctx)
        })
        .catch(async error => {
            redis.set(`cons-${ctx.from.id}`, '0')
            redis.save()
        await cancel(ctx)
        return await ctx.reply(`
<b>⚠️ Не удалось отправить заявку, попробуйте заново</b>\n ${error.toString()}`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: '♻️ Заново', callback_data: 'apply'}],
                ]
            }
        })
    })
})