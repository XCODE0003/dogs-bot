import {NextFunction} from 'grammy'

import {Context} from "@/database/models/context";

export async function adminMiddleware(ctx: Context, next: NextFunction) {

    if (ctx.user.admin === true) {
        return next()
    }

    return;
}
