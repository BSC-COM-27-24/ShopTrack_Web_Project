import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from './entities/sale.entity';

import { Product } from '../products/entities/product.entity';
import { Restock } from '../restocks/entities/restock.entity';

import { ProductsModule } from '../products/products.module';
import { RestocksModule } from '../restocks/restocks.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Product, Restock]),
    ProductsModule,
    RestocksModule,
    AuthModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}