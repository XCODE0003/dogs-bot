"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHandlersNotifications = void 0;
const grammy_1 = require("grammy");
const callback_1 = require("./callback");
function setupHandlersNotifications(bot) {
    const composer = new grammy_1.Composer();
    composer.callbackQuery('deleteThisMessage', async (ctx) => ctx.deleteMessage());
    composer.use(callback_1.composer);
    bot.use(composer);
}
exports.setupHandlersNotifications = setupHandlersNotifications;
