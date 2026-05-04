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
  ) {}

  async findAll() {
    return this.productRepo.find({ relations: ['restocks'] });
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

  async deleteAll() {
    return this.productRepo.clear();
  }

  /**async create(createBookDto: CreateBookDto): {
const book = this.productRepo.create(createBookDto);
return await this.productRepo.save(book);
  } ***/


  // UPDATE — changes specific fields on an existing book
async update(id: number, updateProductDto: UpdateProductDto){
await this.findOne(id);
await this.productRepo.update(id, updateProductDto);
return await this.findOne(id);
}
// DELETE — removes a product row from the database
async removeOne(id: number): Promise<{ message: string }> {
await this.findOne(id);
await this.productRepo.delete(id);
return { message: `Book ${id} deleted successfully` };
}

async disable(id: number): Promise<void> {
  const product = await this.productRepo.findOne({where: {id}});
  
  if (!product) {
    throw new NotFoundException(`Product ${id} not found`);
  }

  product.isActive = false;
  await this.productRepo.save(product);
}

}

