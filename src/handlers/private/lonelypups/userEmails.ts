import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, InputFile} from "grammy";
import {lonelypupsRepository} from "@/database";
import console from "console";
import {getPictureMenu} from "@/helpers/getPictureMenu";

export const composer = new Composer<Context>()
composer.callbackQuery('private lonelypups user emails', privateLonelyPupsUserEmail)

export async function privateLonelyPupsUserEmail(ctx: Context)  {
    const inline_keyboard = [
    ]

    const emails = await lonelypupsRepository.find({
        where: {
            author: String(ctx.user.tgId)
        }
    })

    for (const email of emails) {
        inline_keyboard.push([{text: email.email.slice(0,18), callback_data: `private lonelypups emailInfo ${email.id}`}])
    }
    inline_keyboard.push([{text: "📩 Создать новую почту", callback_data: `private lonelypups set email`}])
    inline_keyboard.push([{text: "Назад", callback_data: `private menu lonelypups`}])
    return ctx.editMessageCaption({
        reply_markup: {
            inline_keyboard
        }
    })
}
export async function privateLonelyPupsUserForNewMessage(ctx: Context)  {
    const inline_keyboard = [
    ]

    const emails = await lonelypupsRepository.find({
        where: {
            author: String(ctx.user.tgId)
        }
    })

    for (const email of emails) {
        inline_keyboard.push([{text: email.email.slice(0,18), callback_data: `private lonelypups emailInfo ${email.id}`}])
    }
    inline_keyboard.push([{text: "📩 Создать новую почту", callback_data: `private lonelypups set email`}])
    inline_keyboard.push([{text: "Назад", callback_data: `private menu lonelypups`}])
    return ctx.replyWithPhoto(await getPictureMenu(ctx.user),{
        // caption: 'test',
        reply_markup: {
            inline_keyboard
        }
    })
}