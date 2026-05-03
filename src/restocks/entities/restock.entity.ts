import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('restocks')
export class Restock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column()
  productId!: number;

  @ManyToOne(() => Product, (product) => product.restocks, {
    onDelete: 'CASCADE',
  })
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;
}