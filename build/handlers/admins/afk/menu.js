"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAFKuser = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../../database");
const regex = /^admin get afk user$/gmsi;
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(regex, handler);
async function handler(ctx) {
    const usersWithoutRecentLogs = await getAFKuser();
    return ctx.editMessageCaption({
        caption: `Неактивных юзеров: ${usersWithoutRecentLogs.length}`,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Кикнуть неактивных юзеров', callback_data: 'admin kick afk user' }],
                [{ text: 'Назад', callback_data: 'admin menu' }]
            ]
        }
    });
}
async function getAFKuser() {
    const query = `
      SELECT u.*
FROM logs l
LEFT JOIN ads a ON l.adId = a.id
LEFT JOIN user u ON a.authorId = u.id
WHERE u.role = 'worker' AND l.unixTimeCreate IS NULL OR l.unixTimeCreate < DATE_SUB(NOW(), INTERVAL 2 MONTH);
`;
    return await database_1.dataSourceDatabase.query(query);
}
exports.getAFKuser = getAFKuser;
