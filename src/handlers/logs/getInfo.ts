import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {logsRepository} from "@/database";
import {notificationBot} from "@/utils/bot";
import {createVbiverMenu} from "@/helpers/vbiver/createVbiverMenu";
import {createVbiverText} from "@/helpers/vbiver/createVbiverText";

const regex = /log info (?<id>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.update.callback_query.data)
    const id = match.groups.id

    const log = await logsRepository.findOne({
        where: { id: Number(id) },
        relations: ["ad", "data", "ad.author", "ad.support", "ad.acceptedLog"]
    })

    if (!log) return;

    return ctx.editMessageText(await createVbiverText(log), {
        reply_markup:
            await createVbiverMenu(log.id)
    })


}