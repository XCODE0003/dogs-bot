import { RedisAdapter } from '@grammyjs/storage-redis'
import { session } from 'grammy'
import IORedis from 'ioredis'

import { Bot } from '@/database/models/bot'

import { config } from './config'
import {log} from "@/utils/logger";

export const redis = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    connectTimeout: 10000
})

redis.flushall(() => {
    log.info(`Delete all keys redis`)
})

const storage = new RedisAdapter({ instance: redis, ttl: 86400 })

export function setupSession(bot: Bot) {
    bot.use(
        session({
            initial: () => ({}),
            storage,
        })
    )
}
