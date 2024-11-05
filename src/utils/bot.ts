import { Bot } from 'grammy'

import { Context } from '@/database/models/context'

import { config } from './config'

export const bot = new Bot<Context>(config.bot.mainToken)
export const notificationBot = new Bot<Context>(config.bot.notificationToken)

bot.catch((e) => console.log(e))
notificationBot.catch((e) => console.log(e))
