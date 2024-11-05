import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {logsRepository} from "@/database";
import {notificationBot} from "@/utils/bot";
import {createVbiverMenu} from "@/helpers/vbiver/createVbiverMenu";

const regex = /log list tan (?<id>\d+)/gmsi
const regex2 = /log vbiver menu (?<id>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, listTan)
composer.callbackQuery(regex2, vbiverMenu)

async function vbiverMenu(ctx: Context) {
    const match = regex2.exec(ctx.update.callback_query.data)
    const id = match.groups.id

    return ctx.editMessageReplyMarkup({
        reply_markup: await createVbiverMenu(Number(id))
    })
}

async function listTan(ctx: Context)  {
    const match = regex.exec(ctx.update.callback_query.data)
    const id = match.groups.id

    return ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: [
                [{text: "VR", callback_data: `log redirect tan vr ${id}`}],
                [{text: "НАЗАД", callback_data: `log vbiver menu ${id}`}],
            ]
        }
    })


}