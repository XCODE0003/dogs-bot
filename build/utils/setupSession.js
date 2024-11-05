"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSession = exports.redis = void 0;
const storage_redis_1 = require("@grammyjs/storage-redis");
const grammy_1 = require("grammy");
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("./config");
const logger_1 = require("../utils/logger");
exports.redis = new ioredis_1.default({
    host: config_1.config.redis.host,
    port: config_1.config.redis.port,
    connectTimeout: 10000
});
exports.redis.flushall(() => {
    logger_1.log.info(`Delete all keys redis`);
});
const storage = new storage_redis_1.RedisAdapter({ instance: exports.redis, ttl: 86400 });
function setupSession(bot) {
    bot.use((0, grammy_1.session)({
        initial: () => ({}),
        storage,
    }));
}
exports.setupSession = setupSession;
