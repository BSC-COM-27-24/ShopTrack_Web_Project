import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
=======
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
>>>>>>> 93aa00f53501450b841b5728c40aeb4ce861d5e1

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
<<<<<<< HEAD
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
=======
import { RestocksModule } from './restocks/restocks.module';
import { PdfModule } from './pdf/pdf.module';
import { Restock } from './restocks/entities/restock.entity';
>>>>>>> 93aa00f53501450b841b5728c40aeb4ce861d5e1

@Module({

  imports: [
<<<<<<< HEAD
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'localhost',
      port: 1521,                      
      username: 'shoptrack_admin',     
      password: 'shopadmin',           
      serviceName: 'shoptrack_pdb',    
      autoLoadEntities: true,
      synchronize: true,               
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    SalesModule,
=======
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
>>>>>>> 93aa00f53501450b841b5728c40aeb4ce861d5e1
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }