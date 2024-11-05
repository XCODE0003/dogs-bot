"use strict";
exports.__esModule = true;
exports.notificationBot = exports.bot = void 0;
var grammy_1 = require("grammy");
var config_1 = require("./config");
exports.bot = new grammy_1.Bot(config_1.config.bot.mainToken);
exports.notificationBot = new grammy_1.Bot(config_1.config.bot.notificationToken);
exports.bot["catch"](function (e) { return console.log(e); });
exports.notificationBot["catch"](function (e) { return console.log(e); });
