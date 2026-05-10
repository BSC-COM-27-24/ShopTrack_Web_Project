import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('restocks')
export class Restock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  unitCost!: number;

  @Column()
  productId!: number;

  @ManyToOne(() => Product, (product) => product.restocks, {
    onDelete: 'CASCADE',
  })
  product!: Product;

  // NEW: Track which staff member updated the stock
  @ManyToOne(() => User, { eager: true })
  addedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}