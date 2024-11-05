import { Context as DefaultContext, SessionFlavor } from 'grammy'
import {User} from "@/database/models/user";
import {ScenesFlavor, ScenesSessionFlavor} from "grammy-scenes";

type SessionData = ScenesSessionFlavor & {
    deleteMessage: number[]
    logId?: number,
    tgId?: number,
    amount?: string,
    text?: string,
    bank?: string,
    service?: string,
    country?: string,
    anyObject?: object,
    profiles?: Profiles,
    mentors?: Mentors
    supports?: Supports
    profile?: Profile,
    profitManual: ProfitManual,
    customNotification?: CustomNotification
    smsEmail?: SmsEmail
    createAdManual?: CreateAdManual
}

export interface CreateAdManual {
    title?: string,
    description?: string,
    price?: string
    deliveryPrice?: string
    img?: string
}

export interface ProfitManual {

    bank?: string,
    workerId?: number,
    vbiverId?: number,
    profitValue?: number
    email?: boolean
    emailOwner?: string
    sms?: boolean,
    smsOwner?: string,
    service?: string
    country?: string
}

export interface SmsEmail {
    pattern: string,
    ad: number,
    to: string,
    who?: string
    service?: string
    smser?: string
    country?: string
}

export interface CustomNotification {
    text: string,
    photo: string,
    buttons: object
}

export interface Profile {
    data: string,
    id: number
}

export interface Mentors {
    description: string,
    percent: number,
    freedom?: number
}

export interface Supports {
    description: string,
    percent: number,
    code: string
}

export interface Profiles {
    fullName: string
    delivery: string
    phone: string
    service: string
    country: string,
    avatar?: string
}

export type Context<T = {}> = DefaultContext &
    SessionFlavor<SessionData> &
    ScenesFlavor &
    T & {
        user?: User
    }
