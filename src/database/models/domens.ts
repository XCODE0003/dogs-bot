import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Domens {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: "active", type: "boolean", width: 1, default: false})
    active: boolean

    @Column({name: "wasUsed", type: "boolean", width: 1, default: false})
    wasUsed: boolean

    @Column({ name: 'service', type: 'text', unique: false })
    service: string

    @Column({ name: 'country', type: 'text', unique: false })
    country: string

    @Column({ name: 'link', type: 'text' })
    link: string

    @Column({ name: 'dateChange', type: 'datetime' })
    dateChange: string

    @Column({name: "special", type: "boolean", width: 1, default: false})
    special: boolean
}
