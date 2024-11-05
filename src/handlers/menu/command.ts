import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";
import {profitRepository, settingsRepository} from "@/database";
import {User, UserRole} from "@/database/models/user";
import {getPictureMenu} from "@/helpers/getPictureMenu";
import console from "console";
import { config } from "@/utils/config";

const moment = require('moment');

export const composer = new Composer<Context>()
composer.command('start', handlerMenu)
composer.callbackQuery('menu', callbackHandler)
composer.callbackQuery('menuWithPicture', handlerMenu)
composer.callbackQuery('menuNewMessage', callbackHandler2)
// composer.callbackQuery('private in dev', calloback)

const howMuchMoney = async (ctx: Context) => {
    const data = await profitRepository.find({
        relations: {
            worker: true
        },
        where: {
            worker: {
                tgId: ctx.from.id
            }
        }
    })
    let usd = 0

    for (const obj of data) {
        usd += obj.workerValue
    }

    return usd
}

function keyb(user: User) {
    const keyboard = new InlineKeyboard()
        // .text(`EMAIL`, 'private menu lonelypups')
        // .row()
        .text(`Создать ссылку на оплату`, 'create payment link')
        // .text(`👨‍🎓 Наставники`, 'mentors')
        // .text(`💻 Выбрать ТП`, 'support')
        // .row()
        // .text(`${(user.trcAddress) ? 'Сменить' : 'Установить'} TRC-20`, 'setTether')
        // .row()
        // .text(`Настроить ТЭГ`, 'tag')
        .row()
        .url(`💬 ЧАТ`, 'https://t.me/+BheXxUhEqyIxZDli')
        .url(`💸 ВЫПЛАТЫ`, 'https://t.me/+7ixewdC1v6kwNjUy')

        // .text(`⚙️ Настройки`, 'settings')
        // .text(`🗳 Интересное`, 'useful')

    // if (user.admin) {
    //     keyboard.row()
    //     keyboard.text('🕹 Админ-панель', 'admin menu')
    // }

    // if (!user.naVbive && user.role === UserRole.VBIVER) {
    //     keyboard.row()
    //     keyboard.text('🌚 Встать на вбив!', 'user set vbiv true')
    // }
    //
    // if (user.naVbive && user.role === UserRole.VBIVER) {
    //     keyboard.row()
    //     keyboard.text('🐾 Уйти со вбива!', 'user set vbiv false')
    // }

    return keyboard
}



function shuffleId(num: number): number {
    let numStr = num.toString();
    const permutationPattern = [[0,5],[2, 1],[6,3],[4,3],[6,3], [4, 2], [3, 5]];
    let digits = numStr.split('');

    permutationPattern.forEach(pair => {
        const [firstIndex, secondIndex] = pair;

        if (firstIndex < digits.length && secondIndex < digits.length) {
            const temp = digits[firstIndex];
            digits[firstIndex] = digits[secondIndex];
            digits[secondIndex] = temp;
        }
    });

    return parseInt(digits.join(''), 10);
}

function unshuffleId(num: number): number {
    let numStr = num.toString();
    let digits = numStr.split('');
    const permutationPattern = [[0,5],[2, 1],[6,3],[4,3],[6,3], [4, 2], [3, 5]];
   
    // Для дешифровки нужно применить перестановки в обратном порядке
    for (let i = permutationPattern.length - 1; i >= 0; i--) {
        const [firstIndex, secondIndex] = permutationPattern[i];

        // Проверка, чтобы индексы были в пределах длины числа
        if (firstIndex < digits.length && secondIndex < digits.length) {
            const temp = digits[firstIndex];
            digits[firstIndex] = digits[secondIndex];
            digits[secondIndex] = temp;
        }
    }

    return parseInt(digits.join(''), 10);
}
const text = async (ctx: Context) => {
    const settings = await settingsRepository.findOne({where: {id: 1}})

    let timeTeam = null
    if (ctx.user.created) {
        const createDate = moment(ctx.user.created);
        const currentDate = moment();

        const timeDifference = moment.duration(currentDate.diff(createDate));
        timeTeam = timeDifference.humanize()
    }
// <b>🪪 ID:</b> <code>${ctx.user.tgId}</code>
// <b>🏷 TAG:</b> <code>${ctx.user.tag}</code>
// <b>📈 Процент:</b> <code>${(ctx.user.isPro) ? settings.proPercent + '% [PRO]' : settings.percent + '%'}</code>
// <b>💵 Профитов на сумму:</b> <code>${await howMuchMoney(ctx)} USD</code>

//<b>🤖 Статус проекта:</b> <code>${(settings.work) ? '💚 FULL WORK' : '🛑 STOP WORK'}</code>-->

//<b>💌 Есть какие-то вопросы?:</b>-->
//<b><a href="tg://user?id=6424732174">ТС</a></b> или <b><a href="tg://user?id=6514725512">ТС</a></b>-->
// <!--<b>🔐 Тех. проблемы: <a href="tg://user?id=6452070203">КОДЕР</a></b>-->
    return `
🧸 <b>Привет, <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a></b>
${(timeTeam) ? '📅 <b>Ты с нами уже:</b> <code>' + timeTeam + '</code> ' : ''}
🔗 <b>Твоя личная ссылка: ${config.site.url}?s=${shuffleId(ctx.from.id)}</b>
`.replace('\n', '')
}

export async function handlerMenu(ctx: Context)  {
    await ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption: await text(ctx),
        reply_markup: keyb(ctx.user)
    })
    // if (!ctx.user.trcAddress) {
    //     await ctx.reply(`⚠️ Не установлен TRC-20 кошелек в настройках!`, {
    //         reply_markup: {
    //             inline_keyboard: [
    //                 [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
    //             ]
    //         }
    //     })
    // }
}


async function callbackHandler(ctx: Context)  {
    return ctx.editMessageCaption({
        caption: await text(ctx),
        reply_markup: keyb(ctx.user)
    })
}

async function calloback(ctx: Context)  {
    return ctx.answerCallbackQuery({
        text: '🧸 В РАЗРАБОТКЕ',
        show_alert: true
    })
}

export async function callbackHandler2(ctx: Context)  {
    try {
        await ctx.deleteMessage()
    }catch (e) {}

    await ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption: await text(ctx),
        reply_markup: keyb(ctx.user)
    })

    if (!ctx.user.trcAddress) {
        await ctx.reply(`⚠️ Не установлен TRC-20 кошелек в настройках!`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
    }
}