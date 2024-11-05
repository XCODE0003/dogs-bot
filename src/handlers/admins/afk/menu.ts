import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {dataSourceDatabase, logsRepository, mentorsRepository, userRepository} from "@/database";
import {getService, serviceList} from "@/helpers/getServices";
import console from "console";
import {getConnection} from "typeorm";

const regex = /^admin get afk user$/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {

    const usersWithoutRecentLogs = await getAFKuser()

    return ctx.editMessageCaption( {
        caption: `Неактивных юзеров: ${usersWithoutRecentLogs.length}`,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Кикнуть неактивных юзеров', callback_data: 'admin kick afk user'}],
                [{text: 'Назад', callback_data: 'admin menu'}]
            ]
        }
    })
}

export async function getAFKuser() {
    const query = `
      SELECT u.*
FROM logs l
LEFT JOIN ads a ON l.adId = a.id
LEFT JOIN user u ON a.authorId = u.id
WHERE u.role = 'worker' AND l.unixTimeCreate IS NULL OR l.unixTimeCreate < DATE_SUB(NOW(), INTERVAL 2 MONTH);
`;

    return await dataSourceDatabase.query(query);
}