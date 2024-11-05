import {run} from '@grammyjs/runner'

import {beforeStart} from './utils/beforeStart'
import {bot, notificationBot} from './utils/bot'
import {redis} from "@/utils/setupSession";
import {profitRepository, userRepository} from "@/database";
import {getUsername} from "@/helpers/getUsername";
import moment from "moment/moment";
import fs from "fs";
import * as console from "console";
import {config} from "@/utils/config";
import {UserRole} from "@/database/models/user";
import axios from "axios";
import {lonelyRepository} from "@/database/lonelypups";
const mysql = require('mysql2');

async function main() {
    const connection = mysql.createConnection({
        host: 'localhost', // хост базы данных,
        user: 'root', // имя пользователя
        password: 't#D82!mP)zK7qWnL', // пароль пользователя
        database: 'rt5sv_pocketpupsde' // имя базы данных
    });

    connection.connect((err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Успешное подключение к базе данных');
    });

    bot.catch((e) => console.log(e))
    notificationBot.catch((e) => console.log(e))

// bot.use(async (ctx, next) => {
//     console.time(`Processing update ${ctx.update.update_id}`);
//     await next() // runs next middleware
//     // runs after next middleware finishes
//     console.timeEnd(`Processing update ${ctx.update.update_id}`);
// })

    bot.on('chat_join_request', async ctx => {
        try {
            const chatId = ctx.update.chat_join_request.chat.id
            const userId = ctx.update.chat_join_request.from.id
            if (chatId === config.chats.chat) {
                const user = await userRepository.findOne({
                    where: {
                        tgId: userId
                    }
                })
                if (!user) {
                    return  ctx.api.declineChatJoinRequest(chatId,userId)
                }
                if (user.role === UserRole.WORKER || user.role === UserRole.VBIVER) {
                    return ctx.api.approveChatJoinRequest(ctx.update.chat_join_request.chat.id, ctx.update.chat_join_request.from.id)
                }
            }

            if (chatId !== config.chats.proChat) return;

            const profits = await profitRepository.find({
                relations: ['worker'],
                where: {
                    worker: {
                        tgId: userId
                    }
                }
            })

            const user = await userRepository.findOne({
                where: {
                    tgId: userId
                }
            })

            if (!user) return;

            if (!user.isPro) {
                await ctx.api.declineChatJoinRequest(chatId,userId)
                return ctx.api.sendMessage(userId, '⚠️ Ты еще не сделал 5 профитов для получения доступа к PRO чату', {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                        ]
                    }
                })
            }
            return ctx.api.approveChatJoinRequest(ctx.update.chat_join_request.chat.id, ctx.update.chat_join_request.from.id)
        } catch (e) {console.log(e)}

    })
    beforeStart()
    bot.catch((e) => console.log(e))
    notificationBot.catch((e) => console.log(e))

    run(bot).start()
    run(notificationBot).start()

// const bot2 = run(notificationBot)


    interface UserList {
        userId: number,
        today: number,
        yesterday: number,
        twoWeaksAgo: number,
        allDays: number,
        username?: string,
    }

    interface Data {
        allCash: number,
        users: UserList[]
    }

    async function getTop() {
        const data: Data = { allCash: 0, users: [] }

        const profits = await profitRepository.find({
            relations: ['worker']
        })

        for (const profit of profits) {
            const userIndex = data.users.findIndex(item => item.userId === profit.worker.tgId)

            let user: UserList = data.users[userIndex]
            if (userIndex === -1) {
                user =  { allDays: 0, today: 0, twoWeaksAgo: 0, userId: profit.worker.tgId, yesterday: 0}
            }

            const profitDate = moment(profit.created_at)
            const nowDate = moment(Date.now())

            if (
                profitDate.format('YY MM DD') === nowDate.format('YY MM DD')
            ) { user.today += profit.workerValue }

            if (
                profitDate.format('YY MM DD') === nowDate.subtract(1, 'day').format('YY MM DD')
            ) { user.yesterday += profit.workerValue }

            let minutes = (Date.now() - Date.parse(String(profitDate)))/86400000;       //86400000 - ms в дне
            minutes = Math.round(minutes)

            if (minutes < 13) {
                user.twoWeaksAgo += profit.workerValue
            }

            user.allDays += profit.workerValue
            data.allCash += profit.value

            if (userIndex === -1) {
                data.users.push(user)
            } else {
                data.users[userIndex] = user
            }
        }

        return data
    }

    async function addUsernames(data: Data) {
        for (const i in data.users) {
            const user = data.users[i]
            const userInDatabase = await userRepository.findOne({
                where: {
                    tgId: user.userId
                }
            })
            user.username = await getUsername(userInDatabase)
            data.users[i] = user
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }
        return data
    }

    async function updateTime (data: Data, time: string) {
        data.users.sort((a, b) => a[time] - b[time]);
        data.users = data.users.slice(data.users.length - 10, data.users.length)
        await redis.set(`top-${time}`, JSON.stringify(await addUsernames(data)))
    }

    async function updateTop (update: boolean) {
        let list = undefined
        try {
            // @ts-ignore
            list = JSON.parse(fs.readFileSync('assets/usersTop.json', 'utf-8'))
        } catch (e) {}

        if (!list || update === true) {
            console.log('UPDATE TOP ___->')
            list = await getTop()
            // @ts-ignore
            fs.writeFileSync('assets/usersTop.json', JSON.stringify(list), 'utf-8')
        }

        // @ts-ignore
        await updateTime(JSON.parse(fs.readFileSync('assets/usersTop.json')), 'today')
        // @ts-ignore
        await updateTime(JSON.parse(fs.readFileSync('assets/usersTop.json')), 'yesterday')
        // @ts-ignore
        await updateTime(JSON.parse(fs.readFileSync('assets/usersTop.json')), 'twoWeaksAgo')
        // @ts-ignore
        await updateTime(JSON.parse(fs.readFileSync('assets/usersTop.json')), 'allDays')


    }
    // setInterval(updateTop, 1000 * 60 * 15, true)
    // setInterval(checkKThandeler, 1000 * 60 * 10, undefined,bot)
    // setTimeout(updateTop, 5000, false)

// async function deleteOldAds() {
//     const ads = await adsRepository.find()
//
//     for (const ad of ads) {
//         const date = new Date(ad.created)
//         if ( date.getDate() < 25 ) {
//             ad.delete = true
//             ad.page = ''
//             ad.pageMobile = ''
//         }
//     }
//
//     await adsRepository.save(ads)
//
// }
// setTimeout(test, 5000)
}

// process.on('uncaughtException', async (code) => {
//     await axios.post(`https://api.telegram.org/bot6456147214:AAHQK-US4PM2W6rEwWNlJi1ppyrP1qwTv7Y/sendMessage`, {
//         chat_id: -4038244082,
//         text: "Бот упал",
//     }).then(console.log).catch(console.log)
//
//     process.exit(1)
// });

main().then()