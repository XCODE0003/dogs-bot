// import {Context, ProfitManual} from "@/database/models/context";
// import {Scene} from "grammy-scenes";
// import {Composer, InlineKeyboard} from "grammy";
// import {deleteAllMessages} from "@/helpers/deleteAllMessages";
// import {logsRepository, profitRepository, settingsRepository, userRepository} from "@/database";
// import {User, UserRole} from "@/database/models/user";
// import {getUsername} from "@/helpers/getUsername";
// import {percentageDistributor} from "@/helpers/percentageDistributor";
// import {stickerList} from "@/utils/stickerList";
// import {config} from "@/utils/config";
// import {Profit} from "@/database/models/profit";
// import {getService, serviceList} from "@/helpers/getServices";
// import {getFlagEmoji} from "@/helpers/getFlagEmoji";
// import {getCountryByCountryCode} from "@/helpers/getCountryByCountryCode";
// import {checkProStatus} from "@/handlers/logs/profit";
//
// export const scene = new Scene<Context>('profitManual')
// export const composer = new Composer<Context>()
// const regex = /^\/profit\s+(?<workerId>\d+)/gmi
// composer.hears(regex, handler)
// const callbackIdFixBag = new Set<string>()
//
// async function handler(ctx: Context)  {
//     if (!ctx.user.admin) return;
//     const match = regex.exec(ctx.match[0])
//
//     await ctx.scenes.enter('profitManual', {
//         workerId: match.groups.workerId
//     })
// }
//
// scene.always().callbackQuery('cancel profitManual', async (ctx) => {
//     await deleteAllMessages(ctx.session.deleteMessage, ctx)
//     ctx.scene.exit()
// })
// async function cancel (ctx) {
//     await deleteAllMessages(ctx.session.deleteMessage,ctx)
//     ctx.scene.exit()
// }
// scene.do(async (ctx) => {
//     ctx.session.profitManual = {}
//     ctx.session.profitManual.workerId = Number(ctx.scene.opts.arg.workerId)
//     ctx.session.deleteMessage = []
//
//     const keyboard = new InlineKeyboard()
//
//     for (const i in serviceList) {
//         const service = serviceList[i]
//         if (i === '3' || i === '6' || i === '9') {
//             keyboard.row()
//         }
//         keyboard.text(`${service.name.toUpperCase()}`, `profit set ${service.name}`)
//     }
//
//     keyboard.row()
//     keyboard.text(`Отмена`, `cancel profitManual`)
//
//     await ctx.reply("<b>Выбери сервис</b>", {
//         reply_markup: keyboard
//     })
//     ctx.scene.resume()
// })
//
// scene.wait().callbackQuery(/profit set (?<service>\w+)/gmi, async ctx => {
//     const match = /profit set (?<service>\w+)/gmi.exec(ctx.callbackQuery.data)
//     const keyboard = new InlineKeyboard()
//     const service = getService(match.groups.service)
//
//     for (const i in service.country) {
//         const countryCode = service.country[i]
//         if (i === '2' || i === '4' || i === '6') { keyboard.row() }
//         keyboard.text(`${getFlagEmoji(countryCode)} ${getCountryByCountryCode(countryCode)}`,`profit set ${service.name}-${countryCode}`)
//     }
//     keyboard.row()
//     keyboard.text(`Отмена`, `cancel log-profit`)
//
//     await ctx.editMessageText(`Выбери страну для <b>${service.name.toUpperCase()}</b>`, {
//         reply_markup: keyboard
//     })
//     ctx.scene.resume()
// })
//
// scene.wait().callbackQuery(/profit set (?<service>\w+)-(?<country>\w+)/gmi, async ctx => {
//     try {
//         ctx.deleteMessage()
//     } catch (e) {}
//     const match = /profit set (?<service>\w+)-(?<country>\w+)/gmi.exec(ctx.callbackQuery.data)
//     ctx.session.profitManual.service = match.groups.service
//     ctx.session.profitManual.country = match.groups.country
//
//     const vbivers = await userRepository.find({
//         where: {
//             role: UserRole.VBIVER
//         }
//     })
//     const markup = new InlineKeyboard()
//
//     for (const vbiver of vbivers) {
//         markup.row()
//         markup.text(`${await getUsername(vbiver,false,true)}`, `${vbiver.tgId}`)
//     }
//
//     markup.row()
//     markup.text('Отмена', 'cancel profitManual')
//
//     await ctx.reply("<b>Выбери вбивера</b>", {
//         reply_markup:  markup
//     })
//
//     ctx.scene.resume()
// })
//
// scene.wait().callbackQuery(/^(?<tgId>\d+)/gmi, async (ctx) => {
//     try {
//         ctx.deleteMessage()
//     } catch (e) {}
//     const match = /^(?<tgId>\d+)/gmi.exec(ctx.callbackQuery.data)
//     ctx.session.profitManual.vbiverId = Number(match.groups.tgId)
//
//     await ctx.reply("<b>Выберы sms|email</b>", {
//         reply_markup:  new InlineKeyboard()
//             .text('Anamefa', 'anafema')
//             .text('YourMailer', 'yourmailer')
//             .text('KeshMail', 'keshmail')
//             .text('MAIL +', 'mailplus')
//             .row()
//             .text('SMS', 'sms')
//             .text('SMS +', 'smsplus')
//             .row()
//             .text('Отмена', 'cancel profitManual')
//     })
//
//     ctx.scene.resume()
// })
//
// scene.wait().callbackQuery(/^keshmail|yourmailer|sms|anafema|mailplus|smsplus/gmi, async ctx => {
//     try {
//         ctx.deleteMessage()
//     } catch (e) {}
//     if (ctx.callbackQuery.data === 'sms') {
//         ctx.session.profitManual.smsOwner = "GOOSE"
//         ctx.session.profitManual.sms = true
//     }
//
//     if (ctx.callbackQuery.data === 'sms') {
//         ctx.session.profitManual.smsOwner = 'SMS +'
//         ctx.session.profitManual.sms = true
//     }
//
//     if (ctx.callbackQuery.data === 'keshmail') {
//         ctx.session.profitManual.email = true
//         ctx.session.profitManual.emailOwner = 'keshmail'
//     }
//
//     if (ctx.callbackQuery.data === 'anafema') {
//         ctx.session.profitManual.email = true
//         ctx.session.profitManual.emailOwner = 'anafema'
//     }
//
//     if (ctx.callbackQuery.data === 'yourmailer') {
//         ctx.session.profitManual.email = true
//         ctx.session.profitManual.emailOwner = 'yourmailer'
//     }
//
//     if (ctx.callbackQuery.data === 'mailplus') {
//         ctx.session.profitManual.email = true
//         ctx.session.profitManual.emailOwner = 'mailplus'
//     }
//
//
//     const msg = await ctx.reply("<b>Введи сумму профита в USD</b>", {
//         reply_markup:  new InlineKeyboard()
//             .text('Отмена', 'cancel profitManual')
//     })
//
//     ctx.session.deleteMessage.push(msg.message_id)
//     ctx.scene.resume()
// })
//
//
// scene.wait().hears(/(^\d+)/gmi, async ctx => {
//     try {
//         ctx.deleteMessage()
//     } catch (e) {}
//     const match = /(^\d+)/gmi.exec(ctx.match[0])
//     ctx.session.profitManual.profitValue = Number(match[1])
//
//     const msg = await ctx.reply("<b>Введи название банка</b>", {
//         reply_markup:  new InlineKeyboard()
//             .text('Отмена', 'cancel profitManual')
//     })
//
//     ctx.session.deleteMessage.push(msg.message_id)
//     ctx.scene.resume()
// })
//
// scene.wait().on('message:text', async ctx => {
//     try {
//         ctx.deleteMessage()
//     } catch (e) {}
//     ctx.session.profitManual.bank = ctx.message.text
//
//     const user = await userRepository.findOne({
//         relations: ['mentor', 'mentor.user','supportUser', "supportUser.user"],
//         where: {
//             tgId: ctx.session.profitManual.workerId
//         }
//     })
//     if (!user) {
//         await ctx.reply('user undefined')
//         return cancel(ctx)
//     }
//
//     const vbiver = await userRepository.findOne({
//         where: {
//             tgId: ctx.session.profitManual.vbiverId,
//         }
//     })
//     if (!vbiver) {
//         await ctx.reply('vbiver undefined')
//         return cancel(ctx)
//     }
//
//     const settings = await settingsRepository.findOne({
//         where: {
//             id: 1
//         }
//     })
//
//     let userFate = await percentageDistributor(Number(ctx.session.profitManual.profitValue), (user.isPro) ? settings.proPercent : settings.percent)
//     let mentorFate = undefined
//     let supportFate = undefined
//
//     if (user.mentor) {
//         mentorFate = await percentageDistributor(Number(ctx.session.profitManual.profitValue), user.mentor.percent)
//         userFate -= mentorFate
//     }
//
//     if (user.supportUser) {
//         supportFate = await percentageDistributor(Number(ctx.session.profitManual.profitValue), user.supportUser.percent)
//         userFate -= supportFate
//     }
//
//     let smsEmailPercent = undefined
//     if (ctx.session.profitManual.email || ctx.session.profitManual.sms) {
//         if (ctx.session.profitManual.emailOwner === 'keshmail') {
//             smsEmailPercent = await percentageDistributor(Number(ctx.session.profitManual.profitValue), 5)
//             userFate -= smsEmailPercent
//         } else {
//             smsEmailPercent = await percentageDistributor(Number(ctx.session.profitManual.profitValue), 5)
//             userFate -= smsEmailPercent
//         }
//     }
//
//
//
//     const res = await ctx.reply(`
// ${getFlagEmoji(ctx.session.profitManual.country)} <b>${ctx.session.profitManual.service.toUpperCase()}</b>
// 🏦 Банк: ${ctx.session.profitManual.bank}
// 🐨 Завел: ${await getUsername(user)}
// ➖➖➖➖➖➖➖
// <b>Сумма:</b> ${ctx.session.profitManual.profitValue} USD
// <b>Доля:</b> ${userFate} USD\n<b>${(ctx.session.profitManual.email) ? '\nEMAIL: +' : (ctx.session.profitManual.sms) ? '\nSMS: +' : ''}</b>${(mentorFate !== undefined) ? "\n<b>Наставник:</b> " + await getUsername(user.mentor.user) + " 🌿 " + mentorFate + " USD" : ''}${(supportFate !== undefined) ? "\n<b>ТП:</b> " + await getUsername(user.supportUser.user) + " 🌿 " + supportFate + " USD" : ''}
// <b>Вбивал:</b> ${await getUsername(vbiver)} 💳
//     `, {
//         reply_markup: {
//             inline_keyboard: [
//                 [{text: "Готово", callback_data: `doProfit`}],
//                 [{text: "Отмена", callback_data: `cancel profitManual`}],
//             ]
//         }
//     })
//     await deleteAllMessages(ctx.session.deleteMessage, ctx)
//     ctx.session.deleteMessage.push(res.message_id)
//
//     ctx.scene.resume()
// })
//
// scene.wait().callbackQuery('doProfit', async ctx => {
//     const checker = String(ctx.from.id) + String(ctx.callbackQuery.message.message_id)
//     if (callbackIdFixBag.has(checker)) return null
//     callbackIdFixBag.add(checker)
//
//     const user = await userRepository.findOne({
//         relations: ['mentor', 'mentor.user','supportUser', "supportUser.user"],
//         where: {
//             tgId: ctx.session.profitManual.workerId
//         }
//     })
//     if (!user) {
//         await ctx.reply('user undefined')
//         return cancel(ctx)
//     }
//
//     const vbiver = await userRepository.findOne({
//         where: {
//             tgId: ctx.session.profitManual.vbiverId,
//         }
//     })
//     if (!vbiver) {
//         await ctx.reply('vbiver undefined')
//         return cancel(ctx)
//     }
//
//     const settings = await settingsRepository.findOne({
//         where: {
//             id: 1
//         }
//     })
//
//     let userFate = await percentageDistributor(Number(ctx.session.profitManual.profitValue), (user.isPro) ? settings.proPercent : settings.percent)
//     let mentorFate = undefined
//     let supportFate = undefined
//
//     if (user.mentor) {
//         mentorFate = await percentageDistributor(Number(ctx.session.profitManual.profitValue), user.mentor.percent)
//         userFate -= mentorFate
//     }
//
//     if (user.supportUser) {
//         supportFate = await percentageDistributor(Number(ctx.session.profitManual.profitValue), user.supportUser.percent)
//         userFate -= supportFate
//     }
//
//     let smsEmailPercent = undefined
//     if (ctx.session.profitManual.email || ctx.session.profitManual.sms) {
//         if (ctx.session.profitManual.emailOwner === 'keshmail') {
//             smsEmailPercent = await percentageDistributor(Number(ctx.session.profitManual.profitValue), 5)
//             userFate -= smsEmailPercent
//         } else {
//             smsEmailPercent = await percentageDistributor(Number(ctx.session.profitManual.profitValue), 5)
//             userFate -= smsEmailPercent
//         }
//     }
//
//     await ctx.api.sendSticker(user.tgId, (Number(ctx.session.profitManual.profitValue) > 999) ? stickerList.successSuccessful : stickerList.aOnMoget)
//     await ctx.api.sendMessage(user.tgId, `
// ✅ Успех успешный!
// ${getFlagEmoji(ctx.session.profitManual.country)} <b>${ctx.session.profitManual.service.toUpperCase()}</b>
// 🏦 Банк: ${ctx.session.profitManual.bank}
// ➖➖➖➖➖➖➖
// <b>Сумма:</b> ${ctx.session.profitManual.profitValue} USD
// <b>Твоя доля:</b> ${userFate} USD\n${(mentorFate !== undefined) ? "\n<b>Наставник:</b> " + await getUsername(user.mentor.user) + " 🌿 " + mentorFate + " USD"  : ''}${(supportFate !== undefined) ? "\n<b>ТП:</b> " + await getUsername(user.supportUser.user) + " 🌿 " + supportFate + " USD"  : ''}
// <b>Вбивал:</b> ${await getUsername(vbiver)} 💳
//         `)
//
//     const text = `
// ${getFlagEmoji(ctx.session.profitManual.country)} <b>${ctx.session.profitManual.service.toUpperCase()}</b>
// 🏦 Банк: ${ctx.session.profitManual.bank}
// 🐨 Завел: ${await getUsername(user)}
// 💸 Процент: ${(user.isPro) ? settings.proPercent : settings.percent}%
// ➖➖➖➖➖➖➖
// <b>Сумма:</b> ${ctx.session.profitManual.profitValue} USD
// <b>Доля:</b> ${userFate} USD\n<b>${(ctx.session.profitManual.email) ? '\nEMAIL: +' : (ctx.session.profitManual.sms) ? '\nSMS: +' : ''}</b>${(mentorFate !== undefined) ? "\n<b>Наставник:</b> " + await getUsername(user.mentor.user) + " 🌿 " + mentorFate + " USD"  : ''}${(supportFate !== undefined) ? "\n<b>ТП:</b> " + await getUsername(user.supportUser.user) + " 🌿 " + supportFate + " USD"  : ''}
// <b>Вбивал:</b> ${await getUsername(vbiver)} 💳
//     `
//     const payment = await ctx.api.sendMessage(config.chats.payments, text, {
//         reply_markup: {
//             inline_keyboard: [
//                 [{text: "⌚ Выплачивается ⌚️", callback_data: `oaooaoaaoaoa`}]
//             ]
//         }
//     })
//
//     const profit = new Profit()
//     profit.value = Number(ctx.session.profitManual.profitValue)
//     profit.worker = user
//     profit.workerValue = userFate
//     if (user.mentor) {
//         profit.mentorValue = mentorFate
//         profit.mentor = user.mentor
//     }
//     if (user.supportUser) {
//         profit.supportValue = supportFate
//         profit.support = user.supportUser
//     }
//     profit.vbiver = vbiver
//     profit.msgId = payment.message_id
//
//     let text2 = `
// ${getFlagEmoji(ctx.session.profitManual.country)} <b>${ctx.session.profitManual.service.toUpperCase()}</b>
// 🐨 <b>Воркер:</b> ${await getUsername(user, true, true)}
// 🌱 <b>ID объявления:</b> <code>Ручной профит</code>
//
// 🌳 <b>Вписано:</b> ${await getUsername(vbiver, true, true)} 🌿 ${profit.value} USD
// 🏦 <b>Банк:</b> ${ctx.session.profitManual.bank}
//
// 🐨 <b>Воркер:</b> ${await getUsername(user, true, true)} 🌿 ${userFate} USD
// 🌳 <b>Tether (TRC-20):</b> <code>${user.trcAddress}</code>
//     `
//
//     if (mentorFate) {
//         text2 += `➖➖➖➖➖➖➖`
//         text2 += `\n🐨 <b>Наставник:</b> (${await getUsername(user.mentor.user, true, true)}) 🌿 ${profit.mentorValue} USD`
//         text2 += `\n🌳 <b>Tether (TRC-20):</b> <code>${user.mentor.user.trcAddress}</code>`
//     }
//
//     if (supportFate) {
//         text2 += `➖➖➖➖➖➖➖`
//         text2 += `\n🐨 <b>ТП</b> (${await getUsername(user.supportUser.user)}) 🌿 ${profit.supportValue} USD`
//         text2 += `\n🌳 <b>Tether (TRC-20):</b> <code>${user.supportUser.user.trcAddress}</code>`
//     }
//
//     if (ctx.session.profitManual.email) {
//         text2 += `\n➖➖➖➖➖➖➖`
//         text2 += `\n💌 <b>Отправитель: EMAIL 🌿 ${smsEmailPercent} USD | ${ctx.session.profitManual.emailOwner}</b>`
//     } else if (ctx.session.profitManual.sms) {
//         text2 += `\n➖➖➖➖➖➖➖`
//         text2 += `\n📲 <b>Отправитель: SMS 🌿 ${await percentageDistributor(Number(profit.value), 5)} USD | ${ctx.session.profitManual.smsOwner}</b>`
//     }
//
//     await profitRepository.save(profit)
//
//     await ctx.api.sendMessage(config.chats.accounting, text2, {
//         reply_markup: {
//             inline_keyboard: [
//                 [{text: "♻️ Не выплатил", callback_data: `admin set paid true ${profit.id}`}]
//             ]
//         }
//     })
//
//
//     await ctx.api.sendSticker(config.chats.chat, (Number(ctx.session.profitManual.profitValue) > 999) ? stickerList.successSuccessful : stickerList.aOnMoget)
//     await ctx.copyMessage(config.chats.chat)
//     await ctx.deleteMessage()
//
//     await ctx.reply('Профит успешно вписан', {
//         reply_markup: {
//             inline_keyboard: [
//                 [{text: "Закрыть", callback_data: `deleteThisMessage`}],
//             ]
//         }
//     })
//     // log.ad.author.lastProfit = profit
//
//     // await userRepository.save(user)
//     if (user.mentor) {
//         checkWorkerFreedom(user,ctx).then()
//     }
//
//     if (!user.isPro) {
//         await checkProStatus(ctx, user, settings)
//     }
//
//     try {
//         if (ctx.session.profitManual.emailOwner === 'yourmailer') {
//             await ctx.api.sendMessage(-852647521, `
// 🔥 УСПЕШНО - ${ctx.session.profitManual.service.toUpperCase()} 🔥
// 💰 Сумма: ${profit.value} USD
// 📩 Выплата Mail (5%) ${await percentageDistributor(Number(profit.value), 5)} USD
// 👷 Воркер: ${await getUsername(user, true, true)}
//         `)
//         }  else if (ctx.session.profitManual.emailOwner === 'keshmail') {
//             await ctx.api.sendMessage(-1001946736507, `
// 🔥 УСПЕШНО - ${ctx.session.profitManual.service.toUpperCase()} 🔥
// 💰 Сумма: ${profit.value} USD
// 📩 Выплата Mail (5%) ${await percentageDistributor(Number(profit.value), 5)} USD
// 👷 Воркер: ${await getUsername(user, true, true)}
//         `)
//         } else if (ctx.session.profitManual.emailOwner === 'anafema' ) {
//             await ctx.api.sendMessage(-963739772, `
// 🔥 УСПЕШНО - ${ctx.session.profitManual.service.toUpperCase()} 🔥
// 💰 Сумма: ${profit.value} USD
// 📩 Выплата Mail (7%) ${await percentageDistributor(Number(profit.value), 7)} USD
// 👷 Воркер: ${await getUsername(user, true, true)}
//         `)
//         }
//     } catch (e) {}
//     ctx.scene.exit()
// })
//
// async function checkWorkerFreedom(worker: User,ctx: Context) {
//     const profits = await profitRepository.find({
//         relations: {mentor: true, worker: true},
//         where: {
//             mentor: worker.mentor,
//             worker: {
//                 tgId: worker.tgId
//             }
//         }
//     })
//
//     if (profits.length >= worker.mentor.freedom) {
//         worker.mentor = null
//         await userRepository.save(worker)
//
//         await ctx.api.sendMessage(worker.tgId, `
// 🐨 Ты сделал достаточное кол-во профитов: <code>${profits.length}</code>
// Теперь ты свободен!`, {
//             parse_mode: "HTML",
//             reply_markup: {
//                 inline_keyboard: [
//                     [{text: "Закрыть", callback_data: `deleteThisMessage`}]
//                 ]
//             }
//         }).catch(console.log)
//
//         await ctx.api.sendMessage(worker.tgId, `
// 🐨 ${await getUsername(worker,true,true)} сделал с тобой профитов: <code>${profits.length}</code>
// Увы, но теперь он не твой ученик
//     `, {
//             reply_markup: {
//                 inline_keyboard: [
//                     [{text: "Закрыть", callback_data: `deleteThisMessage`}]
//                 ]
//             }
//         }).catch(console.log)
//
//         return null
//     }
// }
//
