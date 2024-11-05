import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, OneToOne} from 'typeorm'
import {Logs} from "@/database/models/logs";
import {User} from "@/database/models/user";

@Entity()
export class Orders {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'email', type: "int", unique: false })
    orderId: number

    @Column({ name: 'deliveryPrice', type: 'decimal',precision: 10, scale: 2, unique: false })
    deliveryPrice: number

    @ManyToOne(() => User)
    acceptedLog: User
}