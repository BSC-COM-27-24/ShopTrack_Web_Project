import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestocksController } from './restocks.controller';
import { RestocksService } from './restocks.service';
import { Restock } from './entities/restock.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restock, Product])],
  controllers: [RestocksController],
  providers: [RestocksService],
})
export class RestocksModule {}