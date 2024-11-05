import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn} from 'typeorm'
import {User} from "@/database/models/user";

@Entity()
export class Mentors {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @Column({name: "description", type: "text"})
    description: string

    @Column({name: "percent", type: "int"})
    percent: number

    @Column({name: "freedom", type: "int"})
    freedom: number

    @Column({name: "active", type: "boolean", width: 1, default: true})
    active: boolean

    @CreateDateColumn()
    created_at: Date;
}