import { Composer } from 'grammy'

import { Bot } from '@/database/models/bot'
import { Context } from '@/database/models/context'

import { composer as parseComposer } from './parseUrl'
import { composer as menu } from './menu'
import { composer as private2 } from './private'
import { composer as settings } from './settings'
import { composer as work } from './work'
import { composer as ads } from './ads'
import { composer as services } from './services'
import { composer as logs } from './logs'
import { composer as mentors } from './mentors'
import { composer as admins } from './admins'
import { composer as profiles } from './profiles'
import { composer as tag } from './tag'
import { composer as vbiver } from './vbiver'
import { composer as apply } from './other/apply'
import { composer as verifyNotificationBOT } from './other/verifyNotificationBOT'
import {composer as support} from "@/handlers/support";
import {composer as chats} from "@/handlers/chats";

import {allScenes} from "@/handlers/scenes";
import {privateMiddleware} from "@/middlewares/private";
import {chatMiddleware} from "@/middlewares/chat";

export function setupHandlers(bot: Bot) {
    try {
        const composer = new Composer<Context>()
            composer.callbackQuery('deleteThisMessage', async (ctx) => {
                try {
                    await ctx.deleteMessage().catch()
                } catch (e) {
                    console.log(e)
                }
            })

        composer.use(allScenes.manager())
        composer.use(apply)
        composer.use(verifyNotificationBOT)

        composer.use(chatMiddleware)
        composer.use(chats)

        composer.use(privateMiddleware)

        composer.use(parseComposer)

        composer.use(menu)
        composer.use(private2)
        composer.use(work)
        composer.use(profiles)
        composer.use(services)


        composer.use(settings)
        composer.use(vbiver)
        composer.use(tag)
        composer.use(ads)
        composer.use(support)
        composer.use(logs)
        composer.use(mentors)
        composer.use(allScenes)

        composer.use(admins)

        bot.use(composer)
    } catch (e) {
        console.log(e)
    }
}
