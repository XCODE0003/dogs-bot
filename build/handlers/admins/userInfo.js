"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
const getUsername_1 = require("../../helpers/getUsername");
const user_1 = require("../../database/models/user");
const isSuperAdmin_1 = require("../../helpers/isSuperAdmin");
const moment_1 = __importDefault(require("moment"));
const getPictureMenu_1 = require("../../helpers/getPictureMenu");
const regex = /admin user (?<tgId>\d+)/gmsi;
const regexMSG = /\/admin\s+user\s+(?<tgId>\d+)/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
exports.composer.hears(regexMSG, handler);
async function handler(ctx) {
    let match = undefined;
    if (ctx?.callbackQuery?.data) {
        match = regex.exec(ctx.callbackQuery.data);
    }
    else {
        match = regexMSG.exec(ctx.message.text);
    }
    const tgId = Number(match.groups.tgId);
    const user = await database_1.userRepository.findOne({
        where: {
            tgId
        }
    });
    if (!user)
        return ctx.reply('Пользователь не найден', { reply_markup: { inline_keyboard: [[{ text: 'OK', callback_data: 'deleteThisMessage' }]] } });
    const stats = await getStats(user);
    let text = '';
    text += `🐨 Воркер: ${await (0, getUsername_1.getUsername)(user, true)}`;
    text += `\n🌱 ID пользователя: <code>${user.tgId}</code>`;
    text += `\n\n🌳 Роль: <code>${(user.role === user_1.UserRole.VBIVER) ? 'Вбивер' : (user.role === user_1.UserRole.WORKER) ? 'Воркер' : (user.role === user_1.UserRole.CONSIDERATION) ? 'На рассмотрении' : (user.role === user_1.UserRole.NOTACCEPT) ? 'Отклонен' : (user.role === user_1.UserRole.BAN) ? 'Забанен' : (user.role === user_1.UserRole.RANDOM) ? 'Еще не подал заявку' : 'хз) кодеру напишите'}</code>`;
    text += `\n👑 Админ: <code>${(user.admin) ? "Да" : "Нет"}</code>`;
    text += `\n\n📥 📲: <code>${user.sms}</code>`;
    text += `\n💌 EMAIL: <code>${user.email}</code>`;
    text += `\n\n➖<b>Заслуги на роли воркера</b>➖`;
    text += `\n🔥 Всего профитов: <code>${stats.workerStats.length}</code>`;
    text += `\n💰 На суму: <code>${stats.workerStats.amount}</code>`;
    text += `\n\n➖<b>Заслуги на роли наставника</b>➖`;
    text += `\n🔥 Всего профитов учеников: <code>${stats.mentorStats.length}</code>`;
    text += `\n💰 На суму: <code>${stats.mentorStats.amount}</code>`;
    text += `\n\n<b>Заслуги на роли вбивера</b>➖`;
    text += `\n🔥 Всего вписано профитов: <code>${stats.vbiverStats.length}</code>`;
    text += `\n💰 На суму: <code>${stats.vbiverStats.amount}</code>`;
    text += `\n\n⌚️ В команде ${(0, moment_1.default)(new Date(user.created)).fromNow()}`;
    const options = {
        caption: 'a',
        reply_markup: {
            inline_keyboard: [
                [{ text: '💌 SMS / EMAIL', callback_data: `/admin mailing ${user.tgId}` }],
                [{ text: '💳 ВБИВЕР', callback_data: `/admin vbiver ${user.tgId}` }],
                [{ text: '🐲 Наставник', callback_data: `/admin mentor ${user.tgId}` }, { text: '🐉 ТП', callback_data: `/admin support ${user.tgId}` }],
            ]
        }
    };
    if (user.tgId !== ctx.from.id) {
        options.reply_markup.inline_keyboard.push([{ text: `⛔️ ${(user.role === user_1.UserRole.BAN) ? 'Разбанить' : 'Забанить'}`, callback_data: `admin ban ${user.tgId} choice` }], [{ text: `🦧 Кикнуть`, callback_data: `admin kick ${user.tgId} choice` }]);
    }
    // options.reply_markup.inline_keyboard.push(
    //     [{text: "🐨 Админ панель", callback_data: `admin menu`},{text: "🌿 Меню", callback_data: `menu`}],
    // )
    options.reply_markup.inline_keyboard.push([{ text: (!ctx.user.isPro) ? '👑 Сделать PRO' : '🐾 Убрать PRO', callback_data: `admin set proStatus ${user.id}` }]);
    options.reply_markup.inline_keyboard.push([{ text: "Закрыть", callback_data: `deleteThisMessage` }]);
    if ((0, isSuperAdmin_1.isSuperAdmin)(ctx) && user.tgId !== ctx.from.id) {
        let text = `${(user.admin) ? '🐾 Убрать из администраторов' : '👍 Сделать администратором'}`;
        options.reply_markup.inline_keyboard.push([{ text: text, callback_data: `admin set admin ${(user.admin) ? 'false' : 'true'} ${user.id}` }]);
    }
    options.caption = text;
    if (ctx?.callbackQuery?.data)
        return ctx.editMessageText(text, options);
    return ctx.replyWithPhoto(await (0, getPictureMenu_1.getPictureMenu)(ctx.user), options);
}
async function getStats(user) {
    const mentorStats = { length: 0, amount: 0 };
    const vbiverStats = { length: 0, amount: 0 };
    const workerStats = { length: 0, amount: 0 };
    const mentor = await database_1.mentorsRepository.findOne({
        where: {
            user
        }
    });
    if (mentor) {
        const profits = await database_1.profitRepository.find({
            where: {
                mentor: mentor
            }
        });
        let amount = 0;
        for (const obj of profits) {
            amount += obj.mentorValue;
        }
        mentorStats['length'] = profits.length;
        mentorStats['amount'] = amount;
    }
    if (user.role === user_1.UserRole.VBIVER) {
        const vbiver = await database_1.profitRepository.find({
            where: {
                vbiver: user
            }
        });
        let amount = 0;
        for (const obj of vbiver) {
            amount += obj.value;
        }
        vbiverStats['length'] = vbiver.length;
        vbiverStats['amount'] = amount;
    }
    const workerProfits = await database_1.profitRepository.find({
        where: {
            worker: user
        }
    });
    let amount = 0;
    for (const obj of workerProfits) {
        amount += obj.value;
    }
    workerStats['length'] = workerProfits.length;
    workerStats['amount'] = amount;
    return {
        vbiverStats,
        mentorStats,
        workerStats
    };
}
