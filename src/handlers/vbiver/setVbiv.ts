import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {getUsername} from "@/helpers/getUsername";
import {userRepository} from "@/database";
import {handlerMenu} from "@/handlers/menu/command";
import test from "node:test";
import {config} from "@/utils/config";
import {stickerList} from "@/utils/stickerList";

export const composer = new Composer<Context>()
const regex = /user set vbiv (?<boolean>true|false)/gmi
composer.callbackQuery(regex, handler)

async function handler(ctx: Context)  {
    const match = regex.exec(ctx.callbackQuery.data)
    const boolean = match.groups.boolean

    ctx.user.naVbive = boolean === 'true';
    await userRepository.save(ctx.user)
    await ctx.deleteMessage()
    await handlerMenu(ctx)

    if (ctx.user.naVbive) {
        try {
            await ctx.api.sendSticker(config.chats.chat, stickerList['vbiv'])
        }catch (e){}
    }
    const text = `<b>${await getUsername(ctx.user, true)}</b> ${(ctx.user.naVbive) ? 'на вбиве!' : 'ушел со вбива'}`
    await ctx.api.sendMessage(config.chats.chat, text, {
        parse_mode: 'HTML'
    })
    return ctx.reply(text,{
        reply_markup: {
            inline_keyboard: [
                [{text: "Закрыть", callback_data: "deleteThisMessage"}]
            ]
        }
    })

}