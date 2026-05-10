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
import { PdfService } from '../pdf/pdf.service';
import { EmailService } from '../email/email/email.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private pdfService: PdfService,
    private emailService: EmailService,
  ) { }

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
      unitCost: product.unitCost,
      totalAmount: product.price * quantity,
      totalCost: product.unitCost * quantity,
    });

    const savedSale = await this.saleRepo.save(sale);

    // Find all admins to send notifications to
    const admins = await this.userRepo.find({ where: { role: 'Admin' } });

    // Send low stock alert if stock drops to 5 or below
    if (product.quantity <= 5) {
      for (const admin of admins) {
        await this.emailService.sendLowStockAlert(admin.email, product.name, product.quantity);
      }
    }

    // Generate and send receipt to admin
    if (admins.length > 0) {
      const pdfBuffer = await this.pdfService.generateReceiptPdf(
        savedSale.id,
        product.name,
        quantity,
        savedSale.totalAmount,
        user.username
      );

      for (const admin of admins) {
        await this.emailService.sendEmailWithAttachment(
          admin.email,
          `Sale Receipt - ID: ${savedSale.id}`,
          `A new sale was recorded. Please find the receipt attached.`,
          pdfBuffer,
          `receipt-${savedSale.id}.pdf`
        );
      }
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
      relations: ['product', 'soldBy'],
    });
  }

  async summary() {
    const result = await this.saleRepo
      .createQueryBuilder('sale')
      .select('COUNT(sale.id)', 'totalSales')
      .addSelect('SUM(sale.totalAmount)', 'totalRevenue')
      .addSelect('SUM(sale.totalCost)', 'totalCost')
      .getRawOne();

    const totalRevenue = parseFloat(result.totalRevenue || 0);
    const totalCost = parseFloat(result.totalCost || 0);

    return {
      totalSales: parseInt(result.totalSales || 0),
      totalRevenue,
      totalCost,
      netProfit: totalRevenue - totalCost,
    };
  }
}