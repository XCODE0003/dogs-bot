import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm'

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'percent', type: 'int', nullable: false })
    percent: number

    @Column({ name: 'proPercent', type: 'int', nullable: false })
    proPercent: number

    @Column({ name: 'supportPercent', type: 'int', nullable: false })
    supportPercent: number

    @Column({name: "work", type: "boolean", width: 1, default: true})
    work: boolean
}