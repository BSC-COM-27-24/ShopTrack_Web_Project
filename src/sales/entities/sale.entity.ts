import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ManyToOne(() => User, { eager: true })
  soldBy: User;

  @Column()
  quantity: number;

  @Column('numeric', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('numeric', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalCost: number;

  @CreateDateColumn()
  createdAt: Date;
}