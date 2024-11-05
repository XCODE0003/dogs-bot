export interface Session {
    deleteMessage: number[]
    logId?: number,
    tgId?: number,
    amount?: string,
    service?: string,
    profiles?: Profiles,
    mentors?: Mentors
}

export interface Mentors {
    description: string,
    percent: number
}

export interface Profiles {
    fullName: string
    delivery: string
    phone: string
    service: string
}