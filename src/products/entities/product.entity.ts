import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Restock } from '../../restocks/entities/restock.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('decimal')
  price!: number;

  @Column()
  quantity!: number;

  @OneToMany(() => Restock, restock => restock.product)
  restocks!: Restock[];
}