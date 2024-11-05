"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsername = void 0;
const bot_1 = require("../utils/bot");
async function getUsername(user, strict = false, username = false, onlyName = false) {
    const userTelegramData = await bot_1.bot.api.getChat(user?.tgId)
        .catch(() => {
        return 'please update username';
    });
    if ('please update username' === userTelegramData) {
        console.log(`${user?.tgId}, 'please update username'`);
        return `${user?.tgId}, 'please update username'`;
    }
    if (username && strict === true) {
        // @ts-ignore
        return `${"username" in userTelegramData ? '@' + userTelegramData?.username : `@none`} [${user.tgId}]${(user.isPro) ? ' [PRO]' : ''}`;
    }
    if (username && strict === false) {
        // @ts-ignore
        return `${"username" in userTelegramData ? '@' + userTelegramData?.username : `@none`}${(user.isPro) ? ' [PRO]' : ''}`;
    }
    if (user.hideUsername && strict === false) {
        return `#скрыт`;
    }
    if (onlyName) {
        // @ts-ignore
        return "first_name" in userTelegramData ? userTelegramData?.first_name : 'xz';
    }
    // @ts-ignore
    return `<a href="tg://user?id=${user.tgId}">${"first_name" in userTelegramData ? userTelegramData?.first_name : 'none'}${(user.visibilityTag) ? ' #' + user.tag : ''}</a>${(user.isPro) ? ' [PRO]' : ''}`;
}
exports.getUsername = getUsername;
