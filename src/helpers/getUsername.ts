import {User} from "@/database/models/user";
import {bot} from "@/utils/bot";

export async function getUsername(user: User, strict: boolean = false, username: boolean = false, onlyName: boolean = false): Promise<string> {
    const userTelegramData = await bot.api.getChat(user?.tgId)
        .catch(() => {
            return 'please update username'
        })

    if ('please update username' === userTelegramData) {
        console.log(`${user?.tgId}, 'please update username'`)
        return `${user?.tgId}, 'please update username'`
    }

    if (username && strict === true) {
        // @ts-ignore
        return `${"username" in userTelegramData ? '@' + userTelegramData?.username : `@none`} [${user.tgId}]${(user.isPro) ? ' [PRO]' : ''}`
    }

    if (username && strict === false) {
        // @ts-ignore
        return `${"username" in userTelegramData ? '@' + userTelegramData?.username : `@none`}${(user.isPro) ? ' [PRO]' : ''}`
    }

    if (user.hideUsername && strict === false) {
        return `#скрыт`;
    }

    if (onlyName) {
        // @ts-ignore
        return "first_name" in userTelegramData ? userTelegramData?.first_name : 'xz'
    }
    // @ts-ignore
    return `<a href="tg://user?id=${user.tgId}">${"first_name" in userTelegramData ? userTelegramData?.first_name : 'none'}${(user.visibilityTag) ? ' #' + user.tag : ''}</a>${(user.isPro) ? ' [PRO]' : ''}`;
}