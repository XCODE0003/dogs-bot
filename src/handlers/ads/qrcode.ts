import {Context} from "@/database/models/context";
import {Composer, InlineKeyboard, InputFile} from "grammy";
import {adsRepository, domensRepository} from "@/database";
import QRCode from 'qrcode'
const fs = require('fs').promises;
export const composer = new Composer<Context>()
composer.callbackQuery(/^qrcode get (?<id>\d+|paysend)/gmi, handler)

export async function handler(ctx: Context)  {
    const match = /^qrcode get (?<id>\d+|paysend)/gmi.exec(ctx.callbackQuery.data)
    let ad = undefined
    if (match.groups.id === 'paysend') {
        ad = "paysend"
    } else  {
        ad = await adsRepository.findOne({
            relations: ['profile'],
            where: {
                id: Number(match.groups.id)
            }
        })
    }

    if (!ad) return ctx.reply('ad undefined')

    const domen = await domensRepository.findOne({
        where: {
            active: true,
            service: (ad === 'paysend') ? 'paysend' : ad.service
        }
    })
    if (!ad) return ctx.reply('domen undefined')

    try {
        let qrDataUrl = undefined
        if (ad === 'paysend') {
            qrDataUrl = await QRCode.toDataURL(`https://${domen.link}/link/paysend/${ctx.user.id}`)
        } else {
            qrDataUrl = await QRCode.toDataURL(`https://${domen.link}/link/${ad.link}`)
        }

        const base64Data = qrDataUrl.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        try {
            await fs.access(`temp/qrcode_${ad.date}.png`);
            await ctx.replyWithPhoto(new InputFile(`temp/qrcode_${ad.date}.png`),{
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: "deleteThisMessage"}]
                    ]
                }
            })
        } catch (error) {
            await ctx.reply("QR-CODE V2 undefined :(",{
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Закрыть', callback_data: "deleteThisMessage"}]
                    ]
                }
            })
        }

        return ctx.replyWithPhoto(new InputFile(imageBuffer),{
            caption: `⚠️ Если нет второго qr-code, подожди немного`,
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: "deleteThisMessage"}]
                ]
            }
        })
    } catch (err) {
        return ctx.reply('Не удалось создать qr-code',{
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: "deleteThisMessage"}]
                ]
            }
        })
    }
}