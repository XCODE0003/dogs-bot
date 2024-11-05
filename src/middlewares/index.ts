import { Bot } from 'grammy'

import { userMiddleware } from './user'
import {considerationMiddleware} from "@/middlewares/consideration";
import {chatMiddleware} from "@/middlewares/chat";
import {privateMiddleware} from "@/middlewares/private";

export function UserMiddleware(bot: Bot) {
    bot.use(userMiddleware)
}

export function ConsiderationMiddlewares(bot: Bot) {
    bot.use(considerationMiddleware)
}

export function ChatMiddlewares(bot: Bot) {
    bot.use(chatMiddleware)
}


export function PrivateMiddlewares(bot: Bot) {
    bot.use(privateMiddleware)
}