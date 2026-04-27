import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  // =========================
  // CREATE SALE
  // =========================
  async recordSale(user: User, productId: number, quantity: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.quantity < quantity) {
      throw new BadRequestException('Stock too low');
    }

    // reduce stock
    product.quantity -= quantity;
    await this.productRepo.save(product);

    const sale = this.saleRepo.create({
      product,
      soldBy: user,
      quantity,
      unitPrice: product.price,
      totalAmount: product.price * quantity,
    });

    return this.saleRepo.save(sale);
  }

  // =========================
  // GET ALL SALES
  // =========================
  async findAll(user: User) {
    if (user.role === 'Admin') {
      return this.saleRepo.find();
    }

    return this.saleRepo.find({
      where: {
        soldBy: { id: user.id },
      },
    });
  }

  // =========================
  // SALES SUMMARY
  // =========================
  async summary() {
    const result = await this.saleRepo
      .createQueryBuilder('sale')
      .select('COUNT(sale.id)', 'totalSales')
      .addSelect('SUM(sale.totalAmount)', 'totalRevenue')
      .getRawOne();

    return result;
  }

  // =========================
  // DELETE SALE
  // =========================
  async remove(id: number) {
    const sale = await this.saleRepo.findOne({
      where: { id },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return this.saleRepo.delete(id);
  }
}