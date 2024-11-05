import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, ManyToMany} from 'typeorm'
import {Logs} from "@/database/models/logs";
import {Ads} from "@/database/models/ads";
import {Mentors} from "@/database/models/mentors";
import {Supports} from "@/database/models/supports";
import {Profit} from "@/database/models/profit";
import {Profiles} from "@/database/models/profiles";

export enum UserRole {
    RANDOM = 'random',
    CONSIDERATION = 'consideration',
    NOTACCEPT = 'notAccept',
    WORKER = 'worker',
    VBIVER = 'vbiver',
    BAN = 'ban',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'tgId', type: 'bigint', unique: true })
    tgId: number

    @Column({ name: 'isPro', type: 'boolean', default: false })
    isPro: boolean

    @Column({ name: 'tag', type: 'varchar'})
    tag: string

    @Column({ name: 'visibilityTag', type: 'bool', width: 1, default: false })
    visibilityTag: boolean

    @Column({ name: 'hideUsername', type: 'bool', width: 1, default: false })
    hideUsername: boolean

    @Column({ name: 'admin', type: 'bool', width: 1, default: false })
    admin: boolean

    @Column({ name: 'naVbive', type: 'bool', width: 1, default: false })
    naVbive: boolean

    @Column({ name: 'private', type: 'bool', width: 1, default: false })
    private: boolean

    @Column({ name: 'trcAddress', type: 'text', default: null })
    trcAddress: string

    @Column({ name: 'firstName', type: 'text', default: null })
    firstName: string

    @Column({ name: 'supportCode', type: 'text', default: null })
    supportCode: string

    @Column({ name: 'photoMenu', type: 'text', default: null })
    photoMenu: string

    @Column({ name: 'supportTeam', type: 'int', default: 0 })
    supportTeam: boolean

    sms: number

    @Column({ name: 'email', type: 'int', default: 0 })
    email: number

    @ManyToOne(() => Mentors)
    @JoinColumn()
    mentor: Mentors

    @ManyToMany(() => Profiles, {cascade: true})
    @JoinColumn()
    profiles: Profiles[]

    @Column({ type: 'enum', enum: UserRole, default: UserRole.RANDOM })
    role: UserRole

    @OneToMany(() => Ads, (ads) => ads.acceptedLog)
    logs: Logs[]

    @ManyToMany(() => Ads, {cascade: true})
    ads: Ads[]

    @OneToOne(() => Profit)
    @JoinColumn()
    lastProfit: Profit

    @Column({ name: 'created', type: 'datetime', default: null })
    created: string

    @Column({ name: 'vbivDate', type: 'datetime', default: null })
    vbivDate: string
}
