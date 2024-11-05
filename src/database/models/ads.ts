import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, OneToOne} from 'typeorm'
import {User} from "@/database/models/user";
import {Logs} from "@/database/models/logs";
import {Profiles} from "@/database/models/profiles";

@Entity()
export class Ads {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'title', type: 'text' })
    title: string

    @Column({name: "sender", type: "boolean", width: 1, default: false})
    sender: boolean

    @Column({ name: 'seller', type: 'text', default: '{}' })
    seller: string

    @Column({ name: 'email', type: 'text', default: null })
    email: string

    @Column({ name: 'phone', type: 'text', default: null })
    phone: string

    @Column({ name: 'service', type: 'text', default: 'ebay' })
    service: string

    @Column({ name: 'description', type: 'text' })
    description: string

    @Column({ name: 'country', type: 'text' })
    country: string

    @Column({ name: 'price', type: 'text' })
    price: string

    @Column({ name: 'deliveryPrice', type: 'text', default: null })
    deliveryPrice: string

    @Column({ name: 'link', type: 'text' })
    link: string

    @Column({ name: 'originallink', type: 'text' })
    originallink: string

    @Column({ name: 'date', type: 'varchar', unique: true })
    date: string

    @Column({ name: 'img', type: 'text' })
    img: string

    @Column({ name: 'profits', type: 'int', default: 0 })
    profits: number

    @Column({ name: 'views', type: 'int', default: 0 })
    views: number

    @Column({ name: 'page', type: 'longtext', default: 0 })
    page: string

    @Column({ name: 'underService', type: 'text', unique: false, default: null })
    underService: string

    @ManyToOne(() => User)
    support: User

    @ManyToOne(() => User, (user) => user.logs)
    acceptedLog: User

    @Column({ name: 'pageMobile', type: 'longtext', default: 0 })
    pageMobile: string

    @ManyToOne(() => User, (user) => user.ads, {onDelete: "CASCADE"})
    author: User

    @ManyToOne(() => Profiles, (profile) => profile.id)
    profile: Profiles

    @Column({name: "sendNotif", type: "boolean", width: 1, default: false})
    sendNotif: boolean

    @Column({name: "delete", type: "boolean", width: 1, default: false})
    delete: boolean

    @Column({name: "manualCreation", type: "boolean", width: 1, default: false})
    manualCreation: boolean

    @OneToOne(() => Logs)
    @JoinColumn()
    log: Logs

    @Column({ name: 'created', type: 'datetime', default: null })
    created: string
}
