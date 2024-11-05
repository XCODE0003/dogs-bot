"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
async function adminMiddleware(ctx, next) {
    if (ctx.user.admin === true) {
        return next();
    }
    return;
}
exports.adminMiddleware = adminMiddleware;
