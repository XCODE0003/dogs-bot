import { Context } from "@/database/models/context";
import { Scene } from "grammy-scenes";
import { Composer, InlineKeyboard } from "grammy";
import { deleteAllMessages } from "@/helpers/deleteAllMessages";
import { domensRepository } from "@/database";
import axios from "axios";
const config = require("../../../utils/config");

// Определяем тип данных для сессии
interface DeliverySessionData {
    full_name?: string;
    price?: string;
    address?: string;
  
}

type MyContext = Context & { session: { delivery: DeliverySessionData, deleteMessage: number[] } };

export const composer = new Composer<MyContext>();
const regex = /create payment link/g;
composer.callbackQuery(regex, startScene);

async function startScene(ctx: MyContext) {
    return ctx.scenes.enter('create-payment-link');
}

export const scene = new Scene<MyContext>('create-payment-link');

async function cancel(ctx: MyContext) {
    await deleteAllMessages(ctx.session.deleteMessage, ctx);
}

scene.always().callbackQuery('cancel create-payment-link', cancel);

scene.do(async (ctx) => {
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

scene.wait().hears(/.+/g, async (ctx) => {
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
            const response_api = await axios.post(config.config.site.url + '/api/delivery/create', {data})
            const paymentLink = `${config.config.site.url}/delivery/${response_api.data.UUID}`;

            await ctx.reply(`🔗 Ссылка на оплату: ${paymentLink}`, {
                reply_markup: new InlineKeyboard().text('Назад', 'menu')
            });

            return cancel(ctx);
      
      default:
            const response = await ctx.reply('Ошибка: неверный шаг.');
            ctx.session.deleteMessage.push(response.message_id);
            return cancel(ctx);
    }
});



