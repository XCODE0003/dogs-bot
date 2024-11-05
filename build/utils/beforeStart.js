"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeStart = void 0;
const parse_mode_1 = require("@grammyjs/parse-mode");
const notificationHandlers_1 = require("../notificationHandlers");
const middlewares_1 = require("../middlewares");
const bot_1 = require("./bot");
const database_1 = require("../database");
const logger_1 = require("../utils/logger");
const setupSession_1 = require("./setupSession");
const handlers_1 = require("../handlers");
async function beforeStart() {
    bot_1.bot.api.config.use((0, parse_mode_1.parseMode)('HTML'));
    bot_1.notificationBot.api.config.use((0, parse_mode_1.parseMode)('HTML'));
    (0, setupSession_1.setupSession)(bot_1.bot);
    (0, middlewares_1.UserMiddleware)(bot_1.bot);
    (0, middlewares_1.ConsiderationMiddlewares)(bot_1.bot);
    (0, handlers_1.setupHandlers)(bot_1.bot);
    (0, notificationHandlers_1.setupHandlersNotifications)(bot_1.notificationBot);
    return await database_1.dataSourceDatabase
        .initialize()
        .then(() => {
        logger_1.log.debug('Successfully connected to database');
    })
        .catch((e) => logger_1.log.fatal('Error while connect to database ', e));
}
exports.beforeStart = beforeStart;
