"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllMessages = void 0;
async function deleteAllMessages(array, ctx) {
    for (const id of array) {
        try {
            await ctx.api.deleteMessage(ctx.chat.id, id);
            await new Promise((resolve) => setTimeout(resolve, 1000 * 0.25));
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.deleteAllMessages = deleteAllMessages;
