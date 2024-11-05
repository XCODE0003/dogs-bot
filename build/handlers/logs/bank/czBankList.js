"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.czBankList = void 0;
const czBankList = (id) => {
    return {
        "reply_markup": {
            "inline_keyboard": [
                [
                    {
                        "text": "🔹 ING",
                        "callback_data": `log redirect bank-ing ${id} false`
                    },
                    {
                        "text": "🔹 MBANK BANK",
                        "callback_data": `log redirect bank-mbank ${id} false`
                    }
                ],
                [
                    {
                        "text": "🔹 RAIFFEISEN BANK",
                        "callback_data": `log redirect bank-raiffeisenbank ${id} false`
                    },
                    {
                        "text": "🔹 CITI BANK",
                        "callback_data": `log redirect bank-citi ${id} false`
                    }
                ],
                [
                    {
                        "text": "🔹 Ceska Sporitelna",
                        "callback_data": `log redirect bank-ceskaSporitelna ${id} false`
                    },
                    {
                        "text": "🔹 AIR BANK",
                        "callback_data": `log redirect bank-airbank ${id} false`
                    }
                ],
                [
                    {
                        "text": "🔹 KB BANK",
                        "callback_data": `log redirect bank-kb ${id} false`
                    },
                    {
                        "text": "🔹 MONETA BANK",
                        "callback_data": `log redirect bank-moneta ${id} false`
                    }
                ],
                [
                    {
                        "text": "🔹 FIO BANK",
                        "callback_data": `log redirect bank-fio ${id} false`
                    },
                    {
                        "text": "🔹 CNB BANK",
                        "callback_data": `log redirect bank-cnb ${id} false`
                    }
                ],
                [
                    {
                        "text": "🔹 EXPO BANK",
                        "callback_data": `log redirect bank-expo ${id} false`
                    }
                ],
                [
                    {
                        "text": "Назад",
                        "callback_data": `log vbiver menu ${id}`
                    }
                ]
            ]
        }
    };
};
exports.czBankList = czBankList;
