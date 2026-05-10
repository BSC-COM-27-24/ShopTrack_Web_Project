import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PdfModule } from '../pdf/pdf.module';
import { EmailModule } from '../email/email/email.module';
import { AuthModule } from '../auth/auth.module';

import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Product, User]),
    AuthModule,
    PdfModule,
    EmailModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}