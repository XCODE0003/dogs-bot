import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm'
import {User} from "@/database/models/user";
import {Mentors} from "@/database/models/mentors";
import {Supports} from "@/database/models/supports";

@Entity()
export class Profit {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: "isPaid", type: "bool", width: 1, default: false})
    isPaid: boolean

    @ManyToOne(() => User)
    @JoinColumn()
    worker: User

    @Column({name: "zagnobil", type: "boolean", width: 1, default: false})
    zagnobil: boolean

    @ManyToOne(() => User)
    @JoinColumn()
    vbiver: User

    @ManyToOne(() => Mentors)
    @JoinColumn()
    mentor: Mentors

    @ManyToOne(() => User)
    @JoinColumn()
    support: User

    @Column({ name: 'value', type: 'int', nullable: false })
    value: number

    @Column({ name: 'workerValue', type: 'int', nullable: false })
    workerValue: number

    @Column({ name: 'vbiverValue', type: 'int', nullable: true })
    supportValue: number

    @Column({ name: 'mentorValue', type: 'int', nullable: true })
    mentorValue: number

    @Column({ name: 'msgId', type: 'bigint' })
    msgId: number

    @CreateDateColumn()
    created_at: Date;
}
