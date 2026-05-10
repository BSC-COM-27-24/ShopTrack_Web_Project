import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

import { Sale } from './sales/entities/sale.entity';
import { Product } from './products/entities/product.entity';
import { User } from './users/entities/user.entity';

import { SalesModule } from './sales/sales.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RestocksModule } from './restocks/restocks.module';
import { PdfModule } from './pdf/pdf.module';
import { Restock } from './restocks/entities/restock.entity';

@Module({

  imports: [
ConfigModule.forRoot({ isGlobal: true }),
TypeOrmModule.forRootAsync({
imports: [ConfigModule],
inject: [ConfigService],
useFactory: (config: ConfigService) => ({
type: 'oracle',
host: config.get('DB_HOST'),
port: 1521,
username: config.get('DB_USERNAME'),
password: config.get('DB_PASSWORD'),
serviceName: config.get('DB_SERVICE_NAME'),
synchronize: config.get('DB_SYNCHRONIZE') === 'true',
entities: [Product, User, Sale, Restock],
autoLoadEntities: true,
logging: true,
}),
    }),
    UsersModule,
    ProductsModule,
    SalesModule,
    AuthModule,
    RestocksModule,
    PdfModule,
  ],
})
export class AppModule { }