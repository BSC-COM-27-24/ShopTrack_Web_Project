import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restock } from './entities/restock.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class RestocksService {
  constructor(
    @InjectRepository(Restock)
    private restockRepo: Repository<Restock>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  // GET ALL RESTOCKS
  async findAll() {
    return this.restockRepo.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  // CREATE RESTOCK
  async create(productId: number, quantity: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    // UPDATE PRODUCT STOCK
    product.quantity += quantity;
    await this.productRepo.save(product);

    // SAVE RESTOCK RECORD
    const restock = this.restockRepo.create({
      productId,
      quantity,
    });

    return this.restockRepo.save(restock);
  }
}