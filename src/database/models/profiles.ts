import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm'
import {User} from "@/database/models/user";
import {Mentors} from "@/database/models/mentors";

@Entity()
export class Profiles {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'fullName', type: 'text', nullable: false })
    fullName: string

    @Column({ name: 'phone', type: 'text', nullable: false })
    phone: string

    @Column({ name: 'service', type: 'text', nullable: false })
    service: string

    @Column({ name: 'country', type: 'text', nullable: false })
    country: string

    @Column({ name: 'delivery', type: 'text', nullable: false })
    delivery: string

    @Column({ name: 'avatar', type: 'text', nullable: true })
    avatar: string

    @ManyToOne(() => User, {onDelete: "CASCADE"})
    @JoinColumn()
    user: User
}
