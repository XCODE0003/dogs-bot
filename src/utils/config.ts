import * as fs from 'fs'

interface Config {
    neutrinoApi: {
        key: string,
        userId: string
    }
    bot: {
        mainToken: string,
        notificationToken: string
    }
    chats: {
        vbiver: number,
        payments: number,
        supports: number,
        chat: number,
        proChat: number,
        accounting: number
        applications: number
    }
    site: {
        url: string,
    }
    database: {
        type: string
        host: string
        port: number
        username: string
        password: string
        database: string
        logging: boolean
        [key: string]: any
    }
    redis: {
        host: string
        port: number
    }
    superAdmin: number[]
}

type ENVIRONMENT = 'prod' | 'dev' | undefined
export const environment: ENVIRONMENT = process.argv[2] as ENVIRONMENT

export let config: Config

const configPath = __dirname + `/../../config/config.dev.json`
parseConfig()

export const encoding = 'utf-8'

function parseConfig() {
    const file = fs.readFileSync(configPath, encoding)
    config = JSON.parse(file)
}
