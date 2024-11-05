import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {mentorsRepository, profitRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import {User, UserRole} from "@/database/models/user";
import {isSuperAdmin} from "@/helpers/isSuperAdmin";
import moment from "moment";
import {getPictureMenu} from "@/helpers/getPictureMenu";

const regex = /admin user (?<tgId>\d+)/gmsi
const regexMSG = /\/admin\s+user\s+(?<tgId>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)
composer.hears(regexMSG, handler)

async function handler(ctx: Context)  {
    let match = undefined
    if (ctx?.callbackQuery?.data) {
        match = regex.exec(ctx.callbackQuery.data)
    } else  { match = regexMSG.exec(ctx.message.text) }

    const tgId = Number(match.groups.tgId)

    const user = await userRepository.findOne({
        where: {
            tgId
        }
    })

    if (!user) return ctx.reply('Пользователь не найден', {reply_markup: {inline_keyboard: [ [{text: 'OK', callback_data: 'deleteThisMessage'}] ]}})

    const stats = await getStats(user)
    let text = ''
    text += `🐨 Воркер: ${await getUsername(user, true)}`
    text += `\n🌱 ID пользователя: <code>${user.tgId}</code>`

    text += `\n\n🌳 Роль: <code>${(user.role === UserRole.VBIVER) ? 'Вбивер' : (user.role === UserRole.WORKER) ? 'Воркер' : (user.role === UserRole.CONSIDERATION) ? 'На рассмотрении': (user.role === UserRole.NOTACCEPT) ? 'Отклонен' : (user.role === UserRole.BAN) ? 'Забанен' : (user.role === UserRole.RANDOM) ? 'Еще не подал заявку' : 'хз) кодеру напишите'}</code>`
    text += `\n👑 Админ: <code>${(user.admin) ? "Да" : "Нет"}</code>`
    text += `\n\n📥 📲: <code>${user.sms}</code>`
    text += `\n💌 EMAIL: <code>${user.email}</code>`

    text += `\n\n➖<b>Заслуги на роли воркера</b>➖`
    text += `\n🔥 Всего профитов: <code>${stats.workerStats.length}</code>`
    text += `\n💰 На суму: <code>${stats.workerStats.amount}</code>`

    text += `\n\n➖<b>Заслуги на роли наставника</b>➖`
    text += `\n🔥 Всего профитов учеников: <code>${stats.mentorStats.length}</code>`
    text += `\n💰 На суму: <code>${stats.mentorStats.amount}</code>`

    text += `\n\n<b>Заслуги на роли вбивера</b>➖`
    text += `\n🔥 Всего вписано профитов: <code>${stats.vbiverStats.length}</code>`
    text += `\n💰 На суму: <code>${stats.vbiverStats.amount}</code>`

    text += `\n\n⌚️ В команде ${moment(new Date(user.created)).fromNow()}`

    const options = {
        caption: 'a',
        reply_markup: {
            inline_keyboard: [
                [{text: '💌 SMS / EMAIL', callback_data: `/admin mailing ${user.tgId}`}],
                [{text: '💳 ВБИВЕР', callback_data: `/admin vbiver ${user.tgId}`}],
                [{text: '🐲 Наставник', callback_data: `/admin mentor ${user.tgId}`},{text: '🐉 ТП', callback_data: `/admin support ${user.tgId}`}],
            ]
        }
    }

    if (user.tgId !== ctx.from.id) {
        options.reply_markup.inline_keyboard.push(
            [{text: `⛔️ ${(user.role === UserRole.BAN) ? 'Разбанить' : 'Забанить'}`, callback_data: `admin ban ${user.tgId} choice`}],
            [{text: `🦧 Кикнуть`, callback_data: `admin kick ${user.tgId} choice`}],
        )
    }


    // options.reply_markup.inline_keyboard.push(
    //     [{text: "🐨 Админ панель", callback_data: `admin menu`},{text: "🌿 Меню", callback_data: `menu`}],
    // )

    options.reply_markup.inline_keyboard.push(
        [{text: (!ctx.user.isPro) ? '👑 Сделать PRO' : '🐾 Убрать PRO', callback_data: `admin set proStatus ${user.id}`}]
    )

    options.reply_markup.inline_keyboard.push(
        [{text: "Закрыть", callback_data: `deleteThisMessage`}]
    )

    if (isSuperAdmin(ctx) && user.tgId !== ctx.from.id) {
        let text = `${(user.admin) ? '🐾 Убрать из администраторов' : '👍 Сделать администратором'}`
        options.reply_markup.inline_keyboard.push(
            [{text: text, callback_data: `admin set admin ${(user.admin) ? 'false' : 'true'} ${user.id}`}]
        )
    }

    options.caption = text

    if (ctx?.callbackQuery?.data)
        return ctx.editMessageText(text, options)
    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), options)
}

async function getStats(user: User) {
    const mentorStats = {length: 0, amount: 0}
    const vbiverStats = {length: 0, amount: 0}
    const workerStats = {length: 0, amount: 0}

    const mentor = await mentorsRepository.findOne({
        where: {
            user
        }
    })

    if (mentor) {
        const profits = await profitRepository.find({
            where: {
                mentor: mentor
            }
        })
        let amount = 0
        for (const obj of profits) {
            amount += obj.mentorValue
        }

        mentorStats['length'] = profits.length
        mentorStats['amount'] = amount
    }

    if (user.role === UserRole.VBIVER) {
        const vbiver = await profitRepository.find({
            where: {
                vbiver: user
            }
        })
        let amount = 0
        for (const obj of vbiver) {
            amount += obj.value
        }

        vbiverStats['length'] = vbiver.length
        vbiverStats['amount'] = amount
    }

    const workerProfits = await profitRepository.find({
        where: {
            worker: user
        }
    })

    let amount = 0
    for (const obj of workerProfits) {
        amount += obj.value
    }

    workerStats['length'] = workerProfits.length
    workerStats['amount'] = amount

    return {
        vbiverStats,
        mentorStats,
        workerStats
    }
}