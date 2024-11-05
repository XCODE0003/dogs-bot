import {Context} from "@/database/models/context";
import {Composer} from "grammy";
import {User} from "@/database/models/user";
import {mentorsRepository} from "@/database";
import {getPictureMenu} from "@/helpers/getPictureMenu";

export const composer = new Composer<Context>()
composer.callbackQuery('settings', settingsCallback)
composer.callbackQuery('settingsWithPicture', settingsWithPicture)

async function createKeyb(user: User) {
    const keyb = {
        inline_keyboard: [
            [{text: "🌳 Tether (TRC-20)", callback_data: `setTether`}],
            [{text: "🌌 Фото меню", callback_data: `setPhotoMenu`}],
        ]
    }

    if (await isMentor(user)) {
        keyb.inline_keyboard.push([{text: "🐨 Меню наставника", callback_data: `mentors menu`}, {text: "💻 ТП", callback_data: `support`}])
    } else {
        keyb.inline_keyboard.push([{text: "🐨 Наставники", callback_data: `mentors`}, {text: "💻 ТП", callback_data: `support`}])
    }

    keyb.inline_keyboard.push([{text: "🌱 Тег", callback_data: `tag`}])
    keyb.inline_keyboard.push([{text: `${(user.hideUsername) ? '🦇 Раскрыть себя' : '🥷🏼 Скрыть себя'} `, callback_data: `hide`}])
    keyb.inline_keyboard.push([{text: "Назад", callback_data: `menu`}])

    return keyb
}

async function isMentor(user: User) {
    return await mentorsRepository.findOne({
        relations:
            {user: true},
        where: {
            user: {
                tgId: user.tgId
            },
            active: true
        }
    })
}

async function settingsCallback(ctx: Context)  {
    return ctx.editMessageCaption({
        caption: `🌳 <b>Установленный Tether (TRC-20):\n<code>${(ctx.user.trcAddress) ? ctx.user.trcAddress : "⚠️ Не установлен"}</code></b>\n\n<b>ID: <code>${ctx.from.id}</code></b>`,
        reply_markup: await createKeyb(ctx.user)
    })
}

async function settingsWithPicture(ctx: Context)  {
    return ctx.replyWithPhoto(await getPictureMenu(ctx.user), {
        caption: `🌳 <b>Установленный Tether (TRC-20):\n<code>${(ctx.user.trcAddress) ? ctx.user.trcAddress : "⚠️ Не установлен"}</code></b>\n\n<b>ID: <code>${ctx.from.id}</code></b>`,
        reply_markup: await createKeyb(ctx.user)
    })
}