import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 225 })
    name!: string;

    @Column({ length: 225, unique: true })
    username!: string;

    @Column({ length: 225, unique: true })
    email!: string;

    @Column({ length: 225 })
    password!: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: 'Attendant'
    })
    role!: 'Admin' | 'Attendant';

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}