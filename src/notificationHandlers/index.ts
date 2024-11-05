import { Composer } from 'grammy'

import { Bot } from '@/database/models/bot'
import { Context } from '@/database/models/context'

import { composer as callback } from './callback'

export function setupHandlersNotifications(bot: Bot) {
    const composer = new Composer<Context>()

    composer.callbackQuery('deleteThisMessage', async (ctx) => ctx.deleteMessage())

    composer.use(callback)

    bot.use(composer)
}
