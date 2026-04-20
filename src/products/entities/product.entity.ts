import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Restock } from '../../restocks/entities/restock.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column('decimal')
  price!: number;

  @Column('int')
  quantity!: number;

  @Column({ length: 100, nullable: true })
  category!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // RELATION TO RESTOCKS (IMPORTANT FOR YOUR PROJECT)
  @OneToMany(() => Restock, (restock) => restock.product)
  restocks!: Restock[];
}