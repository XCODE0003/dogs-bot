"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profilesCreateScene = exports.composer = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const grammy_1 = require("grammy");
const deleteAllMessages_1 = require("../../helpers/deleteAllMessages");
const profiles_1 = require("../../database/models/profiles");
const database_1 = require("../../database");
const getServices_1 = require("../../helpers/getServices");
const getFlagEmoji_1 = require("../../helpers/getFlagEmoji");
const getCountryByCountryCode_1 = require("../../helpers/getCountryByCountryCode");
exports.composer = new grammy_1.Composer();
const regex = /^profiles create$/gmi;
exports.composer.callbackQuery(regex, startScene);
async function startScene(ctx) {
    const match = regex.exec(ctx.match[0]);
    // if (match?.groups?.service) {
    //     return ctx.scenes.enter('profiles-create', match?.groups?.service)
    // }
    return ctx.scenes.enter('profiles-create', undefined);
}
exports.profilesCreateScene = new grammy_scenes_1.Scene('profiles-create');
async function cancel(ctx) {
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
}
exports.profilesCreateScene.always().callbackQuery('cancel profiles-create', cancel);
exports.profilesCreateScene.use(async (ctx, next) => {
    ctx.session.profiles = { country: undefined, fullName: undefined, service: undefined, delivery: undefined, phone: undefined };
    if (ctx.scene.opts.arg) {
        // ctx.session.profiles.service = ctx.scene.opts.arg
        return next();
    }
    return next();
});
exports.profilesCreateScene.use(async (ctx, next) => {
    if (true) {
        const keyboard = new grammy_1.InlineKeyboard();
        for (const i in getServices_1.serviceList) {
            const service = getServices_1.serviceList[i];
            if (service.profile) {
                if (i === '2' || i === '4' || i === '6') {
                    keyboard.row();
                }
                keyboard.text(service.name.toUpperCase(), `profiles scene service ${service.name}`);
            }
        }
        keyboard.row();
        keyboard.text('Отмена', `cancel profiles-create`);
        const response = await ctx.reply(`Выбери платформу:`, {
            reply_markup: keyboard
        });
        ctx.session.deleteMessage = [response.message_id];
        return next();
    }
    else {
        const response = await ctx.reply('Платформа выбрана автоматически <code>[EBAY]</code>', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Дальше', callback_data: 'profiles scene service auto' }]
                ]
            }
        });
        ctx.session.deleteMessage = [response.message_id];
        return next();
    }
});
exports.profilesCreateScene.wait().callbackQuery(/^profiles scene service\s+(?<service>\w+)$/gmi, async (ctx) => {
    const match = /profiles scene service\s+(?<service>\w+)/gmi.exec(ctx.callbackQuery.data);
    const serviceName = match?.groups?.service;
    if (serviceName !== 'auto')
        ctx.session.profiles.service = serviceName;
    const keyboard = new grammy_1.InlineKeyboard();
    const service = (0, getServices_1.getService)(match.groups.service);
    for (const i in service.country) {
        const countryCode = service.country[i];
        if (i === '2' || i === '4' || i === '6') {
            keyboard.row();
        }
        keyboard.text(`${(0, getFlagEmoji_1.getFlagEmoji)(countryCode)} ${(0, getCountryByCountryCode_1.getCountryByCountryCode)(countryCode)}`, `profiles scene country ${countryCode}`);
    }
    keyboard.row();
    keyboard.text(`Отмена`, `cancel profiles-create`);
    await ctx.editMessageText(`Выбери страну`, {
        reply_markup: keyboard
    });
    // await ctx.editMessageText(`Введите ФИО`, {
    //     reply_markup: {
    //         inline_keyboard: [
    //             [{text: "Отмена", callback_data: "cancel profiles-create"}]
    //         ]
    //     }
    // })
    ctx.scene.resume();
});
exports.profilesCreateScene.wait().callbackQuery(/^profiles scene country\s+(?<country>\w+)$/gmi, async (ctx) => {
    const match = /profiles scene country\s+(?<country>\w+)/gmi.exec(ctx.callbackQuery.data);
    if (!match?.groups?.country)
        return console.log('охьебать ошибка regex нахуй');
    ctx.session.profiles.country = match?.groups?.country;
    await ctx.editMessageText(`Введи ФИО`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Отмена", callback_data: "cancel profiles-create" }]
            ]
        }
    });
    ctx.scene.resume();
});
exports.profilesCreateScene.wait().on("message:text", async (ctx) => {
    const response = await ctx.reply("Напиши адрес доставки", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Отмена", callback_data: "cancel profiles-create" }]
            ]
        }
    });
    ctx.session.deleteMessage.push(ctx.message.message_id);
    ctx.session.profiles.fullName = ctx.msg.text;
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
exports.profilesCreateScene.wait().on("message:text", async (ctx) => {
    const response = await ctx.reply("Напиши номер телефона", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Отмена", callback_data: "cancel profiles-create" }]
            ]
        }
    });
    ctx.session.deleteMessage.push(ctx.message.message_id);
    ctx.session.profiles.delivery = ctx.msg.text;
    ctx.session.deleteMessage.push(response.message_id);
    ctx.scene.resume();
});
// profi esCreateScene.wait().on('message:photo', async ctx => {
//     const res = await ctx.getFile()
//
//     if (!res) {
//         await ctx.reply('Не найдено фото, попробуй еще раз', {
//             reply_markup:  new InlineKeyboard()
//                 .text('Отмена', 'cancel profiles-create')
//
//         })
//         return ctx.scene.exit()
//     }
//
//     ctx.session.profiles.avatar = res.file_path
//     ctx.scene.resume()
// })
// profilesCreateScene.label('skipAvatar')
exports.profilesCreateScene.wait().on('message:text', async (ctx) => {
    ctx.session.profiles.phone = ctx.msg.text;
    const profiles = await database_1.profilesRepository.find({
        relations: { user: true },
        where: {
            country: ctx.session.profiles.country,
            service: ctx.session.profiles.service,
            user: {
                tgId: ctx.user.tgId
            }
        }
    });
    if (profiles.length > 10) {
        await ctx.reply(`⚠️ <b>Нельзя создавать больше десяти профилей на одной площадке в одной стране</b>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                ]
            }
        });
        return cancel(ctx);
    }
    const profile = new profiles_1.Profiles();
    profile.service = ctx.session.profiles.service;
    profile.phone = ctx.session.profiles.phone;
    profile.delivery = ctx.session.profiles.delivery;
    profile.fullName = ctx.session.profiles.fullName;
    profile.avatar = ctx.session.profiles.avatar;
    profile.country = ctx.session.profiles.country;
    profile.user = ctx.user;
    await database_1.profilesRepository.save(profile);
    let text = '';
    text += `<b>${(0, getFlagEmoji_1.getFlagEmoji)(ctx.session.profiles.country)} ${ctx.session.profiles.service.toUpperCase()}</b>`;
    text += `\n\n👤 ФИО: <code>${ctx.session.profiles.fullName}</code>`;
    text += `\n🏘 Доставка: <code>${ctx.session.profiles.delivery}</code>`;
    text += `\n📲 Номер: <code>${ctx.session.profiles.phone}</code>`;
    await ctx.reply(text, {
        reply_markup: {
            inline_keyboard: [
                // [{text: "Использовать этот профиль", callback_data: `ad create with profile ${profile.id}`}],
                [{ text: "Закрыть", callback_data: "deleteThisMessage" }]
            ]
        }
    });
    await (0, deleteAllMessages_1.deleteAllMessages)(ctx.session.deleteMessage, ctx);
    ctx.scene.exit();
});
