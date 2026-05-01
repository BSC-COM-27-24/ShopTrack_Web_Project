import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from './products/products.module';
import { RestocksModule } from './restocks/restocks.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',        // or mysql/postgres (use your config)
      database: 'shoptrack.db',
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
    ProductsModule,
    RestocksModule,
    SalesModule,   // ⭐ VERY IMPORTANT
  ],
})
export class AppModule {}