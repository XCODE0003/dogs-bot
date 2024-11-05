import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {lonelypupsRepository} from "@/database";

export const composer = new Composer<Context>()
composer.callbackQuery(/private lonelypups emailInfo (?<id>\d+)/, handler)

export async function handler(ctx: Context)  {
    const lonelyEmail = await lonelypupsRepository.findOne({
        where: {id: Number(ctx.match[1])}
    })
    if (!lonelyEmail) return;


    return ctx.editMessageCaption({
        caption: `
📧 <b>Почта:</b> <code>${lonelyEmail.email}</code>
🧢 <b>Цена:</b> <code>${lonelyEmail.deliveryPrice} €</code>
        `,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Удалить',callback_data: `private lonelypups user email delete ${lonelyEmail.id}`}],
                [{text: 'Сменить цену',callback_data: `private lonelypups set amount ${lonelyEmail.id}`}],
                [{text: 'Назад',callback_data: 'private lonelypups user emails'}],
            ]
        }
    })
}