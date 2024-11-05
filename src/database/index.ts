import { DataSource, DataSourceOptions } from 'typeorm'

import { User } from '@/database/models/user'

import { config } from '@/utils/config'
import {Ads} from "@/database/models/ads";
import {Profit} from "@/database/models/profit";
import {Domens} from "@/database/models/domens";
import {ProDomens} from "@/database/models/proDomens";
import {Logs} from "@/database/models/logs";
import {Settings} from "@/database/models/settings";
import {Mentors} from "@/database/models/mentors";
import {Profiles} from "@/database/models/profiles";
import {Supports} from "@/database/models/supports";
import {LogData} from "@/database/models/logData";
import {Lonelypups} from "@/database/models/lonelypups";
import {Orders} from "@/database/models/orders";

const options = config.database as DataSourceOptions
export const dataSourceDatabase = new DataSource({
    ...options,
    entities: [User, Ads, Profit, Orders, Domens, Logs, LogData, Settings, Mentors,Profiles, Supports, ProDomens, Lonelypups],
})

export const userRepository = dataSourceDatabase.getRepository(User)
export const adsRepository = dataSourceDatabase.getRepository(Ads)
export const profitRepository = dataSourceDatabase.getRepository(Profit)
export const domensRepository = dataSourceDatabase.getRepository(Domens)
export const proDomensRepository = dataSourceDatabase.getRepository(ProDomens)
export const logsRepository = dataSourceDatabase.getRepository(Logs)
export const settingsRepository = dataSourceDatabase.getRepository(Settings)
export const mentorsRepository = dataSourceDatabase.getRepository(Mentors)
export const profilesRepository = dataSourceDatabase.getRepository(Profiles)
export const supportsRepository = dataSourceDatabase.getRepository(Supports)
export const lonelypupsRepository = dataSourceDatabase.getRepository(Lonelypups)
export const ordersRepository = dataSourceDatabase.getRepository(Orders)
export const logDataRepository = dataSourceDatabase.getRepository(LogData)
