import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { RestocksModule } from './restocks/restocks.module';
import { PdfModule } from './pdf/pdf.module';

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
        username: config.get('DB_USER'),       // ← changed
        password: config.get('DB_PASS'),       // ← changed
        serviceName: config.get('DB_SERVICE'), // ← changed
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
    }),

    AuthModule,
    UsersModule,
    ProductsModule,
    SalesModule,
    RestocksModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}