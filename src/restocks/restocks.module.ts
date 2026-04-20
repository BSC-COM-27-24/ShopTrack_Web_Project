import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restock } from './entities/restock.entity';
import { Product } from '../products/entities/product.entity';
import { RestocksService } from './restocks.service';
import { RestocksController } from './restocks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Restock, Product])],
  controllers: [RestocksController],
  providers: [RestocksService],
})
export class RestocksModule {}