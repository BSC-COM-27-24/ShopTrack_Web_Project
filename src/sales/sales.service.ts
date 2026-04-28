import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { PdfService } from '../pdf/pdf.service';
import { EmailService } from '../email/email/email.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private pdfService: PdfService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async recordSale(user: User, productId: number, quantity: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.quantity < quantity) {
      throw new BadRequestException('Stock too low');
    }

    product.quantity -= quantity;
    await this.productRepo.save(product);

    const sale = this.saleRepo.create({
      product,
      soldBy: user,
      quantity,
      unitPrice: product.price,
      totalAmount: product.price * quantity,
    });

    const savedSale = await this.saleRepo.save(sale);

    // Send low stock alert if stock drops to 5 or below
    if (product.quantity <= 5) {
      await this.emailService.sendLowStockAlert(product.name, product.quantity);
    }

    // Generate and send receipt to admin
    const adminEmail = this.configService.get<string>('EMAIL_USER');
    if (adminEmail) {
      const pdfBuffer = await this.pdfService.generateReceiptPdf(
        savedSale.id, 
        product.name, 
        quantity, 
        savedSale.totalAmount, 
        user.username
      );
      await this.emailService.sendEmailWithAttachment(
        adminEmail,
        `Sale Receipt - ID: ${savedSale.id}`,
        `A new sale was recorded. Please find the receipt attached.`,
        pdfBuffer,
        `receipt-${savedSale.id}.pdf`
      );
    }

    return savedSale;
  }

  async findAll(user: User) {
    if (user.role === 'Admin') {
      return this.saleRepo.find();
    }

    return this.saleRepo.find({
      where: {
        soldBy: { id: user.id },
      },
    });
  }

  async summary() {
    const result = await this.saleRepo
      .createQueryBuilder('sale')
      .select('COUNT(sale.id)', 'totalSales')
      .addSelect('SUM(sale.totalAmount)', 'totalRevenue')
      .getRawOne();

    return result;
  }

  async remove(id: number) {
    const sale = await this.saleRepo.findOne({
      where: { id },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return this.saleRepo.delete(id);
  }
}