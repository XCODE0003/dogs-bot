export const atBankList = (id: number) => {
  return {
    "reply_markup":{
      "inline_keyboard":[
        [
          {
            "text":"🔹 BANK 99",
            "callback_data": `log redirect bank-b99 ${id} false`
          },
          {
            "text":"🔹 BKS",
            "callback_data": `log redirect bank-bks ${id} false`
          }
        ],
        [
          {
            "text":"🔹 BNP PARIBAS",
            "callback_data": `log redirect bank-bnp-paribas ${id} false`
          },
          {
            "text":"🔹 BANK AUSTRIA",
            "callback_data": `log redirect bank-bank-austria ${id} false`
          }
        ],
        [
          {
            "text":"🔹 EASY",
            "callback_data": `log redirect bank-easy ${id} false`
          },
          {
            "text":"🔹 BTV",
            "callback_data": `log redirect bank-btv ${id} false`
          }
        ],
        [
          {
            "text":"🔹 DKB",
            "callback_data": `log redirect bank-dkb ${id} false`
          },
          {
            "text":"🔹 Volkswagen Bank",
            "callback_data": `log redirect bank-volks ${id} false`
          }
        ],
        [
          {
            "text":"🔹 VKB",
            "callback_data": `log redirect bank-vkb ${id} false`
          },
          {
            "text":"🔹 RAIFFEISEN BANK",
            "callback_data": `log redirect bank-raiffeisen-other ${id} false`
          }
        ],
        [
          {
            "text":"🔹 OBER BANK",
            "callback_data": `log redirect bank-oberbank ${id} false`
          }
        ],
        [
          {
            "text":"🔹 ERSTE BANK",
            "callback_data": `log redirect bank-erste-bank ${id} false`
          },
          {
            "text":"🔹 Hypovorarlberg",
            "callback_data": `log redirect bank-hypovorarlberg ${id} false`
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