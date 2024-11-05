import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {profitRepository, userRepository} from "@/database";
import moment from "moment";
import {getUsername} from "@/helpers/getUsername";
import {redis} from "@/utils/setupSession";
import console from "console";
import {User} from "@/database/models/user";
import {Profit} from "@/database/models/profit";

export const composer = new Composer<Context>()
composer.hears(/^\/top/gsi, handler)
composer.callbackQuery(/top (?<time>\w+)/gsi, handlerCallback)
composer.callbackQuery(/top (?<time>\w+) (?<ownerMessageId>\d+)/gsi, handlerCallback)

interface Users {
    userId: number,
    firstName: string,
    tag: string,
    value: number
}
interface Data {
    allCash: number,
    users: Users[]
}

export async function getTop(time: number): Promise<Data> {
    const data: Data = { allCash: 0, users: [] }

    const timeSearch = new Date();
    timeSearch.setDate(timeSearch.getDate() - time);

    const profits = await profitRepository
        .createQueryBuilder('profit')
        .leftJoinAndSelect('profit.worker', 'worker')
        .where('profit.created_at BETWEEN :startDate AND :endDate', {
            startDate: timeSearch.toISOString(),
            endDate: new Date().toISOString(),
        })
        .getMany();

    for (const profit of profits) {
        data.allCash += profit.value

        const index = data.users.findIndex(user => user.userId === profit.worker.tgId);
        if (index !== -1) {
            data.users[index].value += profit.value
        } else {
            let firstname = ''
            let tag = ''

            if (profit.worker.hideUsername || profit.worker.firstName === null) {
                firstname = 'Скрыто'
                tag = ''
            } else {
                firstname = profit.worker.firstName
                tag = profit.worker.tag
            }

            data.users.push({
                firstName: firstname, tag: tag, userId: profit.worker.tgId, value: profit.value
            })
        }
    }

    data.users.sort((a, b) => b.value - a.value);
    data.users = data.users.slice(0,9)
    return data
}


async function handler(ctx: Context)  {
    // try {
    //     await ctx.deleteMessage()
    // } catch (e) {}
    const data: Data = await getTop(1)

    let text = `🧮 <b>Общая касса проекта:</b> <code>${data.allCash} USD</code>
\n🧸 <b>Топ за сегодня:</b>\n`

    for (const obj of data.users) {
        text += `\n🏷 ${obj.firstName} ${(obj.tag) ? '#' + obj.tag : ''}: ${obj.value} USD`
    }

    const inline_keyboard = [
        [{text: "2 дня", callback_data: `top yesterday ${ctx.from.id}`}, {text: `2 недели`, callback_data: `top twoweeks ${ctx.from.id}`}],
        [{text: "Все время", callback_data: `top allDays ${ctx.from.id}`}],
    ]

    if (ctx.from.id === ctx.chat.id) {
        inline_keyboard.push([{text: "Закрыть", callback_data: `deleteThisMessage`}])
    }
    return ctx.reply(text, {
        reply_markup: {
            inline_keyboard
        }
    })
}

async function handlerCallback(ctx: Context)  {
    const match = /top (?<time>\w+) (?<ownerMessageId>\d+)/gsi.exec(ctx.callbackQuery.data)
    const time = match.groups.time
    const ownerMessageId = match.groups.ownerMessageId

    if (ctx.from.id !== Number(ownerMessageId)) return null

    let days = 0;
    if (time === 'today') { days = 1 }
    if (time === 'yesterday') { days = 2 }
    if (time === 'twoWeaksAgo') { days = 14 }
    if (time === 'allDays') { days = 9999999 }
    let data: Data = await getTop(days)

    let text = `🧮 <b>Общая касса проекта:</b> <code>${data.allCash} USD</code>
\n🧸 <b>Топ за ${(time === 'today' ? 'сегодня' : (time === 'yesterday') ? 'Последние 2 дня' : (time === 'twoWeaksAgo') ? 'две недели' : (time === 'allDays') ? 'все время' : '' )}:</b>\n`


    for (const obj of data.users) {
        text += `\n🏷 ${obj.firstName} ${(obj.tag) ? '#' + obj.tag : ''}: ${obj.value} USD`
    }

    let keyb = [
        [{text: "За вчера", callback_data: `top yesterday ${ctx.from.id}`}, {text: "2 недели", callback_data: `top twoWeaksAgo ${ctx.from.id}`}],
        [{text: "Все время", callback_data: `top allDays ${ctx.from.id}`}],
    ]

    if (time === 'yesterday') {
        keyb = [
            [{text: "За сегодня", callback_data: `top today ${ctx.from.id}`}, {text: "2 недели", callback_data: `top twoWeaksAgo ${ctx.from.id}`}],
            [{text: "Все время", callback_data: `top allDays ${ctx.from.id}`}],
        ]
    }

    if (time === 'allDays') {
        keyb = [
            [{text: "За сегодня", callback_data: `top today ${ctx.from.id}`}, {text: "2 недели", callback_data: `top twoWeaksAgo ${ctx.from.id}`}],
            [{text: "За вчера", callback_data: `top yesterday ${ctx.from.id}`}],
        ]
    }

    if (time === 'twoWeaksAgo') {
        keyb = [
            [{text: "За сегодня", callback_data: `top today ${ctx.from.id}`}, {text: "Все время", callback_data: `top allDays ${ctx.from.id}`}],
            [{text: "За вчера", callback_data: `top yesterday ${ctx.from.id}`}],
        ]
    }

    if (ctx.from.id === ctx.chat.id) {
        keyb.push([{text: "Закрыть", callback_data: `deleteThisMessage`}])
    }

    return ctx.editMessageText(text, {
        reply_markup: {
            inline_keyboard: keyb
        }
    })
}