import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(data: { productId: number; quantity: number }) {
    const product = await this.productRepo.findOne({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (data.quantity <= 0) {
      throw new NotFoundException('Quantity must be greater than 0');
    }

    // UPDATE PRODUCT STOCK
    product.quantity += data.quantity;
    await this.productRepo.save(product);

    //  LOG RESTOCK
    const restock = this.restockRepo.create(data);
    return this.restockRepo.save(restock);
  }

  async findAll() {
    return this.restockRepo.find();
  }
}