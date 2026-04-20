import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Restock } from '../restocks/entities/restock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Restock]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [TypeOrmModule], // optional but useful if other modules need Product/Restock
})
export class ProductsModule {}