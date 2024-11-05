import fetch from "node-fetch";
import * as console from "console";
import axios from "axios";
const querystring = require('querystring');
const request = require('request-promise')

export async function sendSms(phone: string, pattern: string, sender: string, url: string, worker: number) {
    try {

        const data = {
            api_key: "route60_49dj38fh393hd31",
            number: phone,
            code: `${pattern}_${sender}`,
            type: '1',
            url: url,
            worker: worker
        };

        const response = await axios.post("https://sms.hogwarts.app/sendSample", data)
        console.log(response.data)
        return response
    } catch (e) {
        console.log(e)
        return e.toString()
    }
}
export async function sendSmsPaysend(phone: string, text: string, sender: string, url: string, worker: number) {
    try {

        const data = {
            api_key: "route60_49dj38fh393hd31",
            number: phone,
            senderId: 'Paysend',
            text: text,
            type: '1',
            url: url,
            worker: worker
        };

        const response = await axios.post("https://sms.hogwarts.app/send", data)
        console.log(response.data)
        return response.data
    } catch (e) {
        console.log(e)
        return e.toString()
    }
}

export async function sendSmsAmNam(phone: string, senderid: string, service: number, link) {
    try {

        const dataToSend = {
            "api_key": "0aea5a47568c802355304d9746059107",
            "number": phone,
            "senderid": senderid,
            "link": link,
            "service": service
        }
        console.log(dataToSend)
        const encodedData = querystring.stringify(dataToSend);
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const response = await request.post({
            url: 'https://api.amnyam.site/send_sms',
            headers: headers,
            body: encodedData
        })

        return JSON.parse(response)
    } catch (e) {
        console.log(e)
    }
}