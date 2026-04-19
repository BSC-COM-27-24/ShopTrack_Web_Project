import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('users')

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;


    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: 'Attendant'
    })
    role: 'Admin' | 'Attendant';

    @CreateDateColumn()
    createdAt: Date;
}