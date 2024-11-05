"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateMiddlewares = exports.ChatMiddlewares = exports.ConsiderationMiddlewares = exports.UserMiddleware = void 0;
const user_1 = require("./user");
const consideration_1 = require("../middlewares/consideration");
const chat_1 = require("../middlewares/chat");
const private_1 = require("../middlewares/private");
function UserMiddleware(bot) {
    bot.use(user_1.userMiddleware);
}
exports.UserMiddleware = UserMiddleware;
function ConsiderationMiddlewares(bot) {
    bot.use(consideration_1.considerationMiddleware);
}
exports.ConsiderationMiddlewares = ConsiderationMiddlewares;
function ChatMiddlewares(bot) {
    bot.use(chat_1.chatMiddleware);
}
exports.ChatMiddlewares = ChatMiddlewares;
function PrivateMiddlewares(bot) {
    bot.use(private_1.privateMiddleware);
}
exports.PrivateMiddlewares = PrivateMiddlewares;
