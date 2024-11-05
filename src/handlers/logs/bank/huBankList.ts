export const huBankList = (id: number) => {
  return {
    "reply_markup":{
      "inline_keyboard":[
        [
          {
            "text":"🔹 OTP BANK",
            "callback_data": `log redirect bank-otpBank ${id} false`
          },
          {
            "text":"🔹 UNI CREDIT",
            "callback_data": `log redirect bank-unicredit ${id} false`
          }
        ],
        [
          {
            "text":"🔹 K&H BANK",
            "callback_data": `log redirect bank-K&H ${id} false`
          },
          {
            "text":"🔹 RAIFFEISEN BANK",
            "callback_data": `log redirect bank-raiffeisen ${id} false`
          }
        ],
        [
          {
            "text":"🔹 MKB BANK",
            "callback_data": `log redirect bank-mkb ${id} false`
          },
          {
            "text":"🔹 MAGNET BANK",
            "callback_data": `log redirect bank-magnetbank ${id} false`
          }
        ],
        [
          {
            "text":"🔹 CIB BANK",
            "callback_data": `log redirect bank-cib ${id} false`
          },
          {
            "text":"🔹 GRANIT BANK",
            "callback_data": `log redirect bank-granitbank ${id} false`
          }
        ],
        [
          {
            "text":"🔹 ERSTE BANK",
            "callback_data": `log redirect bank-erstebank ${id} false`
          }
        ],
        [
          {
            "text":"Назад",
            "callback_data": `log vbiver menu ${id}`
          }
        ]
      ]
    }
  }
}