"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../../helpers/deleteAllMessages");
const axios_1 = __importDefault(require("axios"));
const config = require("../../../utils/config");
exports.composer = new grammy_1.Composer();
const regex = /create payment link/g;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    return ctx.scenes.enter('create-payment-link');
}
exports.scene = new grammy_scenes_1.Scene('create-payment-link');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
}
exports.scene.always().callbackQuery('cancel create-payment-link', cancel);
exports.scene.do(async (ctx) => {
    ctx.session.delivery = {};
    ctx.session.deleteMessage = [];
    const response = await ctx.reply('Введите имя и фамилию:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Отмена', callback_data: 'cancel create-payment-link' }]
            ]
        }
    });
    ctx.session.deleteMessage.push(response.message_id);
});
exports.scene.wait().hears(/.+/g, async (ctx) => {
    const text = ctx.message.text;
    const currentStep = Object.keys(ctx.session.delivery).length;
    console.log(`Current Step: ${currentStep}, Input Text: ${text}`);
    // Удаление предыдущих сообщений
    while (ctx.session.deleteMessage.length > 0) {
        const messageId = ctx.session.deleteMessage.pop();
        if (messageId) {
            await ctx.api.deleteMessage(ctx.chat.id, messageId);
        }
    }
    // Сохранение идентификатора сообщения пользователя для удаления
    ctx.session.deleteMessage.push(ctx.message.message_id);
    switch (currentStep) {
        case 0:
            const parts = text.split(' ');
            if (parts.length < 2) {
                const response = await ctx.reply('Пожалуйста, введите и имя, и фамилию.');
                ctx.session.deleteMessage.push(response.message_id);
                return;
            }
            ctx.session.delivery.full_name = text;
            const response1 = await ctx.reply('Введите цену:');
            ctx.session.deleteMessage.push(response1.message_id);
            break;
        case 1:
            ctx.session.delivery.price = text;
            const response2 = await ctx.reply('Введите адрес:');
            ctx.session.deleteMessage.push(response2.message_id);
            break;
        case 2:
            ctx.session.delivery.address = text;
            const delivery = ctx.session.delivery;
            const data = {
                fname: delivery.full_name.split(' ')[0],
                lname: delivery.full_name.split(' ')[1],
                address: delivery.address,
                price: delivery.price,
                worker_id: ctx.from.id
            };
            const response_api = await axios_1.default.post(config.config.site.url + '/api/delivery/create', { data });
            const paymentLink = `${config.config.site.url}/delivery/${response_api.data.UUID}`;
            await ctx.reply(`🔗 Ссылка на оплату: ${paymentLink}`, {
                reply_markup: new grammy_1.InlineKeyboard().text('Назад', 'menu')
            });
            return cancel(ctx);
        default:
            const response = await ctx.reply('Ошибка: неверный шаг.');
            ctx.session.deleteMessage.push(response.message_id);
            return cancel(ctx);
    }
});
