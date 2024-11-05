"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/^profile delete (\d+) (question|true)$/gmi, handler);
async function handler(ctx) {
    const match = /^profile delete (\d+) (question|true)$/gmi.exec(ctx.callbackQuery.data);
    if (match[2] === 'question') {
        return ctx.reply(`
⚠️ <b>При удалении профиля, он слетит со всех обьявлений и мамонт увидит пустые значения в полях!</b>
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Удалить', callback_data: ctx.callbackQuery.data.replace('question', 'true') }],
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }],
                ]
            }
        });
    }
    const profile = await database_1.profilesRepository.findOne({
        where: {
            id: Number(match[1])
        }
    });
    if (!profile)
        return ctx.reply('profile undefined');
    const ads = await database_1.adsRepository.find({
        relations: { profile: true },
        where: {
            profile: {
                id: profile.id
            }
        }
    });
    for (const i in ads) {
        ads[i].profile = null;
    }
    await database_1.adsRepository.save(ads);
    await database_1.profilesRepository.delete({ id: profile.id });
    try {
        ctx.deleteMessage();
    }
    catch (e) { }
    return ctx.reply('✅ Профиль успешно удален', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
            ]
        }
    });
}
exports.handler = handler;