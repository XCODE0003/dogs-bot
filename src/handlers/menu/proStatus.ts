import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('useful prostatus', callbackHandler)

function keyb(isPro: boolean) {
    return new InlineKeyboard()
        .row()
        .text(`Назад`, 'useful')
}

async function callbackHandler(ctx: Context)  {
    return ctx.editMessageCaption( {
        caption: `
🐨 При достижении 5 профитов бот автоматически выдаст вам PRO-воркера 🤌
➖➖➖➖➖➖➖➖➖➖➖➖
✅ Когда вы постигли дзен и стали тру коалой вы получаете ряд преимуществ.
➖➖➖➖➖➖➖➖➖➖➖➖
🌿 Ваш процент выплат поднимается на 10% - вместо 60%, вы получите 70%. 📈
🌐 Отдельные домены которые доступны только вам.
💬 Отдельный чат для настоящих коал "PRO".
📨 Отдельные шлюзы отправки email.
🫣 Тег "PRO" в чатах, при желании можем вам его не ставить.
💰 PRO-воркерам выдается бюджет на расходники или аккаунты/номера по запросу.
🛠 Добавим по вашему запросу конкретную площадку под ворк, так же можем ее скрыть для вас.
➖➖➖➖➖➖➖➖➖➖➖➖
‼️Данные преимущества это не конец, они будут обновляться и дополняться, все зависит от вашего актива.
Каждый преданный коала это сердце нашего проекта, мы уважаем и ценим вашу активность.
        `,
        reply_markup: keyb(ctx.user.isPro)
    })
}