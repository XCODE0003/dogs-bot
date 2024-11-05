"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("@grammyjs/runner");
const beforeStart_1 = require("./utils/beforeStart");
const bot_1 = require("./utils/bot");
const setupSession_1 = require("./utils/setupSession");
const database_1 = require("./database");
const getUsername_1 = require("./helpers/getUsername");
const moment_1 = __importDefault(require("moment/moment"));
const fs_1 = __importDefault(require("fs"));
const console = __importStar(require("console"));
const config_1 = require("./utils/config");
const user_1 = require("./database/models/user");
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
    bot_1.bot.catch((e) => console.log(e));
    bot_1.notificationBot.catch((e) => console.log(e));
    // bot.use(async (ctx, next) => {
    //     console.time(`Processing update ${ctx.update.update_id}`);
    //     await next() // runs next middleware
    //     // runs after next middleware finishes
    //     console.timeEnd(`Processing update ${ctx.update.update_id}`);
    // })
    bot_1.bot.on('chat_join_request', async (ctx) => {
        try {
            const chatId = ctx.update.chat_join_request.chat.id;
            const userId = ctx.update.chat_join_request.from.id;
            if (chatId === config_1.config.chats.chat) {
                const user = await database_1.userRepository.findOne({
                    where: {
                        tgId: userId
                    }
                });
                if (!user) {
                    return ctx.api.declineChatJoinRequest(chatId, userId);
                }
                if (user.role === user_1.UserRole.WORKER || user.role === user_1.UserRole.VBIVER) {
                    return ctx.api.approveChatJoinRequest(ctx.update.chat_join_request.chat.id, ctx.update.chat_join_request.from.id);
                }
            }
            if (chatId !== config_1.config.chats.proChat)
                return;
            const profits = await database_1.profitRepository.find({
                relations: ['worker'],
                where: {
                    worker: {
                        tgId: userId
                    }
                }
            });
            const user = await database_1.userRepository.findOne({
                where: {
                    tgId: userId
                }
            });
            if (!user)
                return;
            if (!user.isPro) {
                await ctx.api.declineChatJoinRequest(chatId, userId);
                return ctx.api.sendMessage(userId, '⚠️ Ты еще не сделал 5 профитов для получения доступа к PRO чату', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                        ]
                    }
                });
            }
            return ctx.api.approveChatJoinRequest(ctx.update.chat_join_request.chat.id, ctx.update.chat_join_request.from.id);
        }
        catch (e) {
            console.log(e);
        }
    });
    (0, beforeStart_1.beforeStart)();
    bot_1.bot.catch((e) => console.log(e));
    bot_1.notificationBot.catch((e) => console.log(e));
    (0, runner_1.run)(bot_1.bot).start();
    (0, runner_1.run)(bot_1.notificationBot).start();
    async function getTop() {
        const data = { allCash: 0, users: [] };
        const profits = await database_1.profitRepository.find({
            relations: ['worker']
        });
        for (const profit of profits) {
            const userIndex = data.users.findIndex(item => item.userId === profit.worker.tgId);
            let user = data.users[userIndex];
            if (userIndex === -1) {
                user = { allDays: 0, today: 0, twoWeaksAgo: 0, userId: profit.worker.tgId, yesterday: 0 };
            }
            const profitDate = (0, moment_1.default)(profit.created_at);
            const nowDate = (0, moment_1.default)(Date.now());
            if (profitDate.format('YY MM DD') === nowDate.format('YY MM DD')) {
                user.today += profit.workerValue;
            }
            if (profitDate.format('YY MM DD') === nowDate.subtract(1, 'day').format('YY MM DD')) {
                user.yesterday += profit.workerValue;
            }
            let minutes = (Date.now() - Date.parse(String(profitDate))) / 86400000; //86400000 - ms в дне
            minutes = Math.round(minutes);
            if (minutes < 13) {
                user.twoWeaksAgo += profit.workerValue;
            }
            user.allDays += profit.workerValue;
            data.allCash += profit.value;
            if (userIndex === -1) {
                data.users.push(user);
            }
            else {
                data.users[userIndex] = user;
            }
        }
        return data;
    }
    async function addUsernames(data) {
        for (const i in data.users) {
            const user = data.users[i];
            const userInDatabase = await database_1.userRepository.findOne({
                where: {
                    tgId: user.userId
                }
            });
            user.username = await (0, getUsername_1.getUsername)(userInDatabase);
            data.users[i] = user;
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        return data;
    }
    async function updateTime(data, time) {
        data.users.sort((a, b) => a[time] - b[time]);
        data.users = data.users.slice(data.users.length - 10, data.users.length);
        await setupSession_1.redis.set(`top-${time}`, JSON.stringify(await addUsernames(data)));
    }
    async function updateTop(update) {
        let list = undefined;
        try {
            // @ts-ignore
            list = JSON.parse(fs_1.default.readFileSync('assets/usersTop.json', 'utf-8'));
        }
        catch (e) { }
        if (!list || update === true) {
            console.log('UPDATE TOP ___->');
            list = await getTop();
            // @ts-ignore
            fs_1.default.writeFileSync('assets/usersTop.json', JSON.stringify(list), 'utf-8');
        }
        // @ts-ignore
        await updateTime(JSON.parse(fs_1.default.readFileSync('assets/usersTop.json')), 'today');
        // @ts-ignore
        await updateTime(JSON.parse(fs_1.default.readFileSync('assets/usersTop.json')), 'yesterday');
        // @ts-ignore
        await updateTime(JSON.parse(fs_1.default.readFileSync('assets/usersTop.json')), 'twoWeaksAgo');
        // @ts-ignore
        await updateTime(JSON.parse(fs_1.default.readFileSync('assets/usersTop.json')), 'allDays');
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
main().then();
