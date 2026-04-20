import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { product } from '../entities/product.entity';
@Module({
    imports: [TypeOrmModule.forFeature([product])],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule { }