import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import * as nodemailer from 'nodemailer';

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
  ) {}

  async recordSale(user: User, productId: number, quantity: number) {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) throw new NotFoundException('Product not found');
    if (product.quantity < quantity)
      throw new BadRequestException(`Stock too low. Only ${product.quantity} unit(s) available.`);

    product.quantity -= quantity;
    await this.productRepo.save(product);

    const sale = this.saleRepo.create({
      product, soldBy: user, quantity,
      unitPrice: product.price,
      totalAmount: product.price * quantity,
    });

    const savedSale = await this.saleRepo.save(sale);

    const admins = await this.userRepo.find({ where: { role: 'Admin' } });

    if (product.quantity <= 5) {
      for (const admin of admins) {
        await this.emailService.sendLowStockAlert(admin.email, product.name, product.quantity);
      }
    }

    if (admins.length > 0) {
      const pdfBuffer = await this.pdfService.generateReceiptPdf(
        savedSale.id,
        product.name,
        quantity,
        savedSale.totalAmount,
        user.username,
      );

      for (const admin of admins) {
        await this.emailService.sendEmailWithAttachment(
          admin.email,
          `Sale Receipt - ID: ${savedSale.id}`,
          `A new sale was recorded. Please find the receipt attached.`,
          pdfBuffer,
          `receipt-${savedSale.id}.pdf`,
        );
      }
    }

    return savedSale;
  }

  async findAll(user: User) {
    if (user.role === 'Admin') {
      return this.saleRepo.find({ order: { createdAt: 'DESC' } });
    }
    return this.saleRepo.find({
      where: { soldBy: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async summary() {
    const result = await this.saleRepo
      .createQueryBuilder('sale')
      .select('COUNT(sale.id)', 'totalSales')
      .addSelect('SUM(sale.totalAmount)', 'totalRevenue')
      .getRawOne();
    return {
      totalSales: Number(result.totalSales) || 0,
      totalRevenue: parseFloat(result.totalRevenue) || 0,
    };
  }

  async remove(id: number) {
    const sale = await this.saleRepo.findOne({ where: { id } });
    if (!sale) throw new NotFoundException('Sale not found');
    return this.saleRepo.remove(sale);
  }

  async getReceipt(saleId: number, user: User) {
    const sale = await this.saleRepo.findOne({ where: { id: saleId } });
    if (!sale) throw new NotFoundException('Sale not found');
    if (user.role !== 'Admin' && sale.soldBy.id !== user.id)
      throw new BadRequestException('Access denied');

    return {
      receiptNumber: `RCP-${sale.id.toString().padStart(5, '0')}`,
      date: sale.createdAt,
      product: sale.product.name,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      totalAmount: sale.totalAmount,
      soldBy: sale.soldBy.name,
    };
  }

  async sendDailySalesEmail(adminEmail: string) {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const sales = await this.saleRepo.find({
      where: { createdAt: Between(start, end) },
      order: { createdAt: 'DESC' },
    });

    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);

    const rows = sales.map(s => `
      <tr>
        <td>${s.product.name}</td><td>${s.quantity}</td>
        <td>MWK ${Number(s.unitPrice).toFixed(2)}</td>
        <td>MWK ${Number(s.totalAmount).toFixed(2)}</td>
        <td>${s.soldBy.name}</td>
      </tr>`).join('');

    const html = `
      <h2>Daily Sales — ${new Date().toLocaleDateString()}</h2>
      <table border="1" cellpadding="6">
        <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th><th>Sold By</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>Total Revenue: MWK ${totalRevenue.toFixed(2)}</strong></p>
      <p>Transactions: ${sales.length}</p>`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Shop Truck" <${process.env.MAIL_USER}>`,
      to: adminEmail,
      subject: `Daily Sales — ${new Date().toLocaleDateString()}`,
      html,
    });

    return { message: 'Email sent', totalTransactions: sales.length, totalRevenue };
  }
}