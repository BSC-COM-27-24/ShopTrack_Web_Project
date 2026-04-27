import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Sale } from './sales/entities/sale.entity';
import { Product } from './products/entities/product.entity';
import { User } from './users/entities/user.entity';

import { SalesModule } from './sales/sales.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection (Oracle)
    TypeOrmModule.forRoot({
      type: 'oracle',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,

      entities: [Sale, Product, User],
      autoLoadEntities: true,

      synchronize: true, // ✅ FIXED (for testing only)
    }),

    // Feature modules
    UsersModule,
    ProductsModule,
    SalesModule,
  ],
})
export class AppModule {}