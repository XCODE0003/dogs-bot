import * as fs from "fs";

interface CountryList {
    [key: string]: string
}
const countryByCountryCode: CountryList = JSON.parse(fs.readFileSync('config/countryByCountryCode.json', 'utf-8'))

export const getCountryByCountryCode = (countryCode: string) => {
    return countryByCountryCode[countryCode]
}