"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = void 0;
const config_1 = require("../utils/config");
function isSuperAdmin(ctx) {
    for (const id of config_1.config.superAdmin)
        if (id == ctx.user.tgId)
            return true;
    return false;
}
exports.isSuperAdmin = isSuperAdmin;
