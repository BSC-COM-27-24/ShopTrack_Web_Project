import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('restocks')
export class Restock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @ManyToOne(() => Product, product => product.restocks)
  product!: Product;
}