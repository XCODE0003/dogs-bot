import fetch from "node-fetch";
import {config} from "./config";

export interface IBANinfo {
    country: string
    "country-code": string
    "card-brand": string
    "ip-city": string
    "ip-blocklists": any[]
    "ip-country-code3": string
    "is-commercial": boolean
    "ip-country": string
    "bin-number": string
    issuer: string
    "issuer-website": string
    "ip-region": string
    valid: boolean
    "card-type": string
    "is-prepaid": boolean
    "ip-blocklisted": boolean
    "card-category": string
    "issuer-phone": string
    "currency-code": string
    "ip-matches-bin": boolean
    "country-code3": string
    "ip-country-code": string
}


export async function getIBANinfo(IBAN: number): Promise<IBANinfo | null> {
    try {
        const response = await fetch('https://neutrinoapi.net/bin-lookup?bin-number=' + IBAN, {
            headers: {
                "User-ID": config.neutrinoApi.userId,
                "API-Key": config.neutrinoApi.key
            }
        })
        const data: IBANinfo = await response.json()
        if (data["card-brand"] === '' || data['api-error']) return null

        return data
    } catch (e) {
        return null
    }
}