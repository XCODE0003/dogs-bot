import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, OneToOne} from 'typeorm'
import {Logs} from "@/database/models/logs";
import {User} from "@/database/models/user";

@Entity()
export class Lonelypups {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'email', type: 'text', unique: false })
    email: string

    @Column({ name: 'deliveryPrice', type: 'decimal',precision: 10, scale: 2, unique: false })
    deliveryPrice: number

    @Column({ name: 'author', type: 'text', unique: false })
    author: string
}