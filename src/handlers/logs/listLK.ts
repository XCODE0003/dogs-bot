import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {logsRepository} from "@/database";
import {notificationBot} from "@/utils/bot";
import {createVbiverMenu} from "@/helpers/vbiver/createVbiverMenu";
import {deBankList} from "@/handlers/logs/bank/deBankList";
import {czBankList} from "@/handlers/logs/bank/czBankList";
import {huBankList} from "@/handlers/logs/bank/huBankList";
import {atBankList} from "@/handlers/logs/bank/atBankList";
import {frBankList} from "@/handlers/logs/bank/frBankList";

const regex = /log list LK (?<id>\d+)/gmsi
const regexBank = /log list LK (?<type>\w+) (?<id>\d+)/gmsi
const regex2 = /log vbiver menu (?<id>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, listLK)
composer.callbackQuery(regexBank, listDE)
composer.callbackQuery(regex2, vbiverMenu)

async function vbiverMenu(ctx: Context) {
    const match = regex2.exec(ctx.update.callback_query.data)
    const id = match.groups.id

    return ctx.editMessageReplyMarkup({
        reply_markup: await createVbiverMenu(Number(id))
    })
}

async function listDE(ctx: Context)  {
    const match = regexBank.exec(ctx.update.callback_query.data)
    const id = Number(match.groups.id)

    if (match.groups.type === 'de') return ctx.editMessageReplyMarkup(deBankList(id))
    if (match.groups.type === 'cz') return ctx.editMessageReplyMarkup(czBankList(id))
    if (match.groups.type === 'hu') return ctx.editMessageReplyMarkup(huBankList(id))
    if (match.groups.type === 'at') return ctx.editMessageReplyMarkup(atBankList(id))
    if (match.groups.type === 'fr') return ctx.editMessageReplyMarkup(frBankList(id))

}

async function listLK(ctx: Context)  {
    const match = regex.exec(ctx.update.callback_query.data)
    const id = match.groups.id

    return ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: [
                [{text: "🇩🇪", callback_data: `log list LK de ${id}`}],
                [{text: "🇨🇿", callback_data: `log list LK cz ${id}`}],
                [{text: "НАЗАД", callback_data: `log vbiver menu ${id}`}],
            ]
        }
    })


}