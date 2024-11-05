import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {lonelypupsRepository} from "@/database";
import {privateLonelyPupsUserEmail} from "@/handlers/private/lonelypups/userEmails";

export const composer = new Composer<Context>()
composer.callbackQuery(/private lonelypups user email delete (?<id>\d+)/, handler)

export async function handler(ctx: Context)  {
    const lonelyEmail = await lonelypupsRepository.findOne({
        where: {id: Number(ctx.match[1])}
    })
    if (!lonelyEmail) return;

    await lonelypupsRepository.delete(lonelyEmail)
    await ctx.reply(`
✅ <b>Почта</b> <code>${lonelyEmail.email}</code> <b>была удалена</b>
        `,
        {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть',callback_data: 'deleteThisMessage'}],
                ]
            }
    })

    return privateLonelyPupsUserEmail(ctx)
}