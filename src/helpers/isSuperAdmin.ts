import {config} from "@/utils/config";
import {Context} from "@/database/models/context";

export function isSuperAdmin(ctx: Context): boolean {
    for (const id of config.superAdmin) if (id == ctx.user.tgId) return true

    return false
}
