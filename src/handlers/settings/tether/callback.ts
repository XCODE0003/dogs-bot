import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('setTether', handler)

async function handler(ctx: Context)  { await ctx.scenes.enter('setTether-scene') }