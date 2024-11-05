import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.command('useful', handlerMenu)
composer.callbackQuery('useful', callbackHandler)

function keyb() {
    return new InlineKeyboard()
        .text(`💬 Каналы & Чаты`, 'useful url list for user')
        .row()
        .text(`👑 Преимущества PRO`, 'useful prostatus')
        .row()
        .text(`💳 Вбиверы`, 'vbiv')
        .row()
        .text(`🌳 Правила`, 'rules')
        .text(`🐨 Связь`, 'communication')
        .row()
        .url(`📚 Гайды`, 'https://t.me/+D9xFXVS9w840YTli')
        .row()
        .text(`Главное меню`, 'menu')
}


const text = async (ctx: Context) => {
    return `🐨 KOA - Это не просто команда, а созданный персонаж, который объединил самых амбициозных людей, чтобы разъебывать эту индустрию.
Скоро объявим о следующих проектах...

🐨 В нашей команде воркеры предпочитают установить нашу техническую поддержку для чата на ссылке, так как мы знаем свою работу и имеем бесценный опыт по общению с 🦣. Воркер заводит трафик с площадок, а состав нашей команды проводит обработку под ключ.

🐨 Для чата, в боте интегрирован сервис SmartSupp. Это позволяет качественно проводить общение с 🦣, а также дает возможность установить автоматические приветственные сообщения и ответы.

🐨 Если ты все же решил установить свою техническую поддержку, тогда лови гайд. как зарегистрироваться, настроить и установить свой smartsupp ключ в бота.

🐨 Никаких лишних кнопок и действий, усложняющие тебе работу! В любой момент пришли ссылку на товар в бота, а он сгенерирует для тебя объявление и предложит возможность отправить EMAIL/SMS твоему 🦣.
`.replace('\n', '')
}

export async function handlerMenu(ctx: Context)  {
    return ctx.reply(await text(ctx), {
        reply_markup: keyb()
    })
}

async function callbackHandler(ctx: Context)  {
    return ctx.editMessageCaption( {
        caption: await text(ctx),
        reply_markup: keyb()
    })
}