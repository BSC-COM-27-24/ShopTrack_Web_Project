import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { Restock } from '../restocks/entities/restock.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Restock)
    private restockRepo: Repository<Restock>,
  ) {}

  // ✅ CREATE SALE
  async createSale(productId: number, quantity: number) {

    // 1. Find product
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 2. Check stock
    const stock = await this.restockRepo.findOne({
      where: { product: { id: productId } },
    });

    if (!stock) {
      throw new NotFoundException('Stock record not found');
    }

    if (stock.quantity < quantity) {
      throw new BadRequestException('Not enough stock');
    }

    // 3. Reduce stock
    stock.quantity -= quantity;
    await this.restockRepo.save(stock);

    // 4. Create sale record
    const sale = this.saleRepo.create({
      product,
      quantity,
      totalPrice: product.price * quantity,
    });

    // 5. Save sale
    return await this.saleRepo.save(sale);
  }

  // ✅ GET ALL SALES
  async findAll() {
    return this.saleRepo.find({
      relations: ['product'],
    });
  }

  // ✅ GET ONE SALE
  async findOne(id: number) {
    const sale = await this.saleRepo.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }
}