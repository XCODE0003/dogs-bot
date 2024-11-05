"use strict";
exports.__esModule = true;
exports.setupSession = exports.redis = void 0;
var storage_redis_1 = require("@grammyjs/storage-redis");
var grammy_1 = require("grammy");
var ioredis_1 = require("ioredis");
var config_1 = require("./config");
var logger_1 = require("@/utils/logger");
exports.redis = new ioredis_1["default"]({
    host: config_1.config.redis.host,
    port: config_1.config.redis.port,
    connectTimeout: 10000
});
exports.redis.flushall(function () {
    logger_1.log.info("Delete all keys redis");
});
var storage = new storage_redis_1.RedisAdapter({ instance: exports.redis, ttl: 86400 });
function setupSession(bot) {
    bot.use((0, grammy_1.session)({
        initial: function () { return ({}); },
        storage: storage
    }));
}
exports.setupSession = setupSession;
