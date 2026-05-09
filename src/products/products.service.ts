import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) { }

  async findAll(search?: string, category?: string, page: number = 1, limit: number = 10) {
    const query = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.restocks', 'restock')
      .leftJoinAndSelect('product.updatedBy', 'updatedBy');

    if (search) {
      query.andWhere('(product.name LIKE :search OR product.category LIKE :search)', { search: `%${search}%` });
    }

    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['restocks'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepo.create(createProductDto);
    return this.productRepo.save(product);
  }



  async update(id: number, updateProductDto: UpdateProductDto, user: any) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    product.updatedBy = user;
    return await this.productRepo.save(product);
  }

  // DELETE — removes a product row from the database
  async removeOne(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.productRepo.delete(id);
    return { message: `product ${id} deleted successfully` };
  }

  async disable(id: number, user: any): Promise<void> {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    product.isActive = false;
    product.updatedBy = user;
    await this.productRepo.save(product);
  }
}
