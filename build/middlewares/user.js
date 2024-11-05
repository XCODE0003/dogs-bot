"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const database_1 = require("../database");
const logger_1 = require("../utils/logger");
const user_1 = require("../database/models/user");
const usernames_1 = require("../utils/usernames");
const console_1 = __importDefault(require("console"));
async function userMiddleware(ctx, next) {
    // for (const photo of ctx.message.photo) {
    //     console.log(photo)
    // }
    if (!ctx?.from?.username) {
        if (ctx.from.id !== ctx.chat.id)
            return null;
        const res = await ctx.reply('Установите юзернейм!');
        setTimeout(async () => {
            try {
                await ctx.api.deleteMessage(ctx.chat.id, res?.message_id);
            }
            catch (e) { }
        }, 1000 * 60);
        console_1.default.log(ctx.from.id, ' Не установлен юзернейм');
    }
    const usernames = new usernames_1.Usernames();
    logger_1.log.debug(`Handle user middleware | ${ctx.from.id} | ${ctx.from.username} | ${await usernames.checkUsername(ctx.from.username, ctx.from.id)}`);
    const id = ctx?.from?.id;
    let user;
    user = await database_1.userRepository.findOne({
        where: {
            tgId: ctx.from.id,
        },
        relations: ['mentor', 'mentor.user', 'lastProfit']
    });
    if (!user) {
        user = new user_1.User();
        user.tgId = id;
        user.tag = "tag";
        user.role = user_1.UserRole.RANDOM;
        user.email = 1;
        user.sms = 1;
        await database_1.userRepository.save(user);
    }
    if (ctx.from.first_name !== user.firstName) {
        user.firstName = ctx.from.first_name;
        await database_1.userRepository.save(user);
    }
    ctx.user = user;
    return next();
}
exports.userMiddleware = userMiddleware;
