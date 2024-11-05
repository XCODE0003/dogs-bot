import { parseMode } from '@grammyjs/parse-mode'
import { apiThrottler } from '@grammyjs/transformer-throttler'

import { setupHandlersNotifications } from '@/notificationHandlers'
import {ChatMiddlewares, ConsiderationMiddlewares, PrivateMiddlewares, UserMiddleware} from '@/middlewares'

import {bot, notificationBot} from './bot'
import { dataSourceDatabase } from '@/database'
import {log} from "@/utils/logger";
import { setupSession } from './setupSession'
import {setupHandlers} from "@/handlers";
import * as console from "console";

export async function beforeStart() {
    bot.api.config.use(parseMode('HTML'))
    notificationBot.api.config.use(parseMode('HTML'))
    setupSession(bot)
    UserMiddleware(bot)
    ConsiderationMiddlewares(bot)
    setupHandlers(bot)
    setupHandlersNotifications(notificationBot)
    return await dataSourceDatabase
        .initialize()
        .then(() => {
            log.debug('Successfully connected to database')
        })
        .catch((e) => log.fatal('Error while connect to database ', e))
}
