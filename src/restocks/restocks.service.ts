import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Restock } from './entities/restock.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateRestockDto } from './dto/create-restock.dto';

@Injectable()
export class RestocksService {
  constructor(
    @InjectRepository(Restock)
    private restockRepo: Repository<Restock>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    private dataSource: DataSource,
  ) {}

  // GET ALL RESTOCKS
  async findAll() {
    return this.restockRepo.find({
      relations: ['product', 'addedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // CREATE RESTOCK (Wrapped in transaction for safety)
  async create(user: User, dto: CreateRestockDto) {
    const { productId, quantity, unitCost } = dto;

    return await this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      // 1. UPDATE PRODUCT STOCK and COST
      product.quantity += quantity;
      product.unitCost = unitCost; // Update current inventory cost
      await manager.save(product);

      // 2. SAVE RESTOCK RECORD with user and cost info
      const restock = manager.create(Restock, {
        productId,
        quantity,
        unitCost,
        addedBy: user,
      });

      return await manager.save(restock);
    });
  }
}