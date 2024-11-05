import * as fs from "fs";

export interface ServiceList {
    name: string,
    profile: boolean,
    manualCreation: boolean,
    country: [string]
}
export const serviceList: ServiceList[] = JSON.parse(fs.readFileSync('config/services.json', 'utf-8'))

export const getService = (service: string) => {
    for (const i in serviceList) {
        if (serviceList[i].name === service) return serviceList[i]
    }

    return undefined
}

