import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Restock } from '../../restocks/entities/restock.entity';
import { User } from '../../users/entities/user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column('decimal')
  price!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  unitCost!: number;

  @Column('int')
  quantity!: number;

  @Column({ length: 100, nullable: true })
  category!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  lastUpdatedAt!: Date;

  @ManyToOne(() => User, { nullable: true, eager: true })
  updatedBy!: User;

  @OneToMany(() => Restock, (restock) => restock.product)
  restocks!: Restock[];
}