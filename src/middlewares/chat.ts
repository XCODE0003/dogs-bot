import {InputFile, NextFunction} from 'grammy'

import {log} from '@/utils/logger'
import {Context} from "@/database/models/context";
import {stickerList} from "@/utils/stickerList";
import {profitRepository} from "@/database";

export async function chatMiddleware(ctx: Context, next: NextFunction) {
    if (ctx.user.lastProfit && ctx.chat.id !== ctx.from.id) {
        let currentDate = Date.now();
        let days = (currentDate - Date.parse(ctx.user.lastProfit.created_at.toString()))/86400000;       //86400000 - ms в дне
        days = Math.round(days)

        if (days > 3 && ctx.user.lastProfit.zagnobil === false) {
            try {
                await ctx.replyWithSticker(stickerList.YouFuckingLazy, {
                    reply_to_message_id: ctx.message.message_id
                })
            } catch (e) {}

            ctx.user.lastProfit.zagnobil = true
            await profitRepository.save(ctx.user.lastProfit)
        }
    }

    if (ctx.chat.id !== ctx.from.id) {
        if (ctx.message?.text === 'заводим') {
            try {ctx.replyWithDocument(new InputFile('assets/gif/zavodim.MP4'))} catch (e) {}
        } else if (ctx.message?.text === 'стоп') {
            try {ctx.replyWithDocument(new InputFile('assets/gif/ne_zavodim.MP4'))} catch (e) {}
        }
        else if (ctx.message?.text.toLowerCase() === 'sadkawaii') {
            try {ctx.replyWithPhoto(new InputFile('assets/photos/sadkawaii.jpg'))} catch (e) {}
        }
    }


    return next()
}