import {Context} from "@/database/models/context";

export async function deleteAllMessages(array: number[], ctx: Context) {
    for (const id of array) {
        try {
            await ctx.api.deleteMessage(ctx.chat.id,id)
            await new Promise((resolve) => setTimeout(resolve, 1000 * 0.25))
        } catch (e) {
            console.log(e)
        }
    }
}