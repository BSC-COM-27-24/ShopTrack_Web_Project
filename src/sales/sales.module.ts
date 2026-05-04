import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfModule } from '../pdf/pdf.module';
import { EmailModule } from '../email/email/email.module';

import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Module({
<<<<<<< HEAD
  imports: [TypeOrmModule.forFeature([Sale, Product, User])],
=======
  imports: [
    TypeOrmModule.forFeature([Sale, Product, User]),
    AuthModule,
    PdfModule,
    EmailModule,
  ],
>>>>>>> 93aa00f53501450b841b5728c40aeb4ce861d5e1
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}