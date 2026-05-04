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

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private pdfService: PdfService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

<<<<<<< HEAD

=======
>>>>>>> 93aa00f53501450b841b5728c40aeb4ce861d5e1
  async recordSale(user: User, productId: number, quantity: number) {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) throw new NotFoundException('Product not found');
    if (product.quantity < quantity)
      throw new BadRequestException(
        `Stock too low. Only ${product.quantity} unit(s) available.`,
      );

<<<<<<< HEAD
    
=======
    if (product.quantity < quantity) {
      throw new BadRequestException('Stock too low');
    }

>>>>>>> 93aa00f53501450b841b5728c40aeb4ce861d5e1
    product.quantity -= quantity;
    await this.productRepo.save(product);

    const sale = this.saleRepo.create({
      product,
      soldBy: user,
      quantity,
      unitPrice: product.price,
      totalAmount: product.price * quantity,
    });

<<<<<<< HEAD
    const saved = await this.saleRepo.save(sale);


    if (product.quantity <= 5) {
      await this.sendLowStockAlert(product);
=======
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
>>>>>>> 93aa00f53501450b841b5728c40aeb4ce861d5e1
    }

    return saved;
  }

 
  // Admin sees all; attendant sees only their own
  async findAll(user: User) {
    if (user.role === 'Admin') {
      return this.saleRepo.find({ order: { createdAt: 'DESC' } });
    }
    return this.saleRepo.find({
      where: { soldBy: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

<<<<<<< HEAD
  
=======
>>>>>>> 93aa00f53501450b841b5728c40aeb4ce861d5e1
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

<<<<<<< HEAD
=======
  async remove(id: number) {
    const sale = await this.saleRepo.findOne({
      where: { id },
    });
>>>>>>> 93aa00f53501450b841b5728c40aeb4ce861d5e1

  async getReceipt(saleId: number, user: User) {
    const sale = await this.saleRepo.findOne({ where: { id: saleId } });

    if (!sale) throw new NotFoundException('Sale not found');

  
    if (user.role !== 'Admin' && sale.soldBy.id !== user.id) {
      throw new BadRequestException('Access denied');
    }

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
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const sales = await this.saleRepo.find({
      where: { createdAt: Between(startOfDay, endOfDay) },
      order: { createdAt: 'DESC' },
    });

    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);

    const rows = sales
      .map(
        (s) =>
          `<tr>
            <td>${s.product.name}</td>
            <td>${s.quantity}</td>
            <td>MWK ${Number(s.unitPrice).toFixed(2)}</td>
            <td>MWK ${Number(s.totalAmount).toFixed(2)}</td>
            <td>${s.soldBy.name}</td>
          </tr>`,
      )
      .join('');

    const html = `
      <h2>Daily Sales Report — ${new Date().toLocaleDateString()}</h2>
      <table border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr>
            <th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th><th>Sold By</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>Total Revenue Today: MWK ${totalRevenue.toFixed(2)}</strong></p>
      <p>Total Transactions: ${sales.length}</p>
    `;

    await this.sendEmail(
      adminEmail,
      `Daily Sales Report — ${new Date().toLocaleDateString()}`,
      html,
    );

    return { message: 'Daily sales email sent', totalTransactions: sales.length, totalRevenue };
  }

  
  private async sendLowStockAlert(product: Product) {
    // Fetch admin email from DB or use env variable
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;

    const html = `
      <h3>Low Stock Alert</h3>
      <p>Product <strong>${product.name}</strong> is running low.</p>
      <p>Current stock: <strong>${product.quantity} unit(s)</strong></p>
      <p>Please restock as soon as possible.</p>
    `;

    await this.sendEmail(adminEmail, `Low Stock Alert: ${product.name}`, html);
  }


  private async sendEmail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,   // your system Gmail
        pass: process.env.MAIL_PASS,   // Gmail app password (not your login password)
      },
    });

    await transporter.sendMail({
      from: `"Shop Truck System" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}