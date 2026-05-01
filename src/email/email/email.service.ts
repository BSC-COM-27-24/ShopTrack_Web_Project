import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        // Initialize the transporter using ConfigService
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        try {
            const senderEmail = this.configService.get<string>('EMAIL_USER');
            const info = await this.transporter.sendMail({
                from: `"ShopTrack" <${senderEmail}>`,
                to: to,
                subject: subject,
                text: text,
            });

            console.log('Email sent:', info.response);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async sendLowStockAlert(to: string, prouctName: string, currentStock: number) {
        const subject = `Low Stock Alert: ${prouctName}`;

        const text = `The product ${prouctName} is running low.
Current stock: ${currentStock}.
Please consider reordering the product soon.`;


        return this.sendEmail(to, subject, text);
    }

    async sendDailySalesReport(adminEmail: string, totalSales: number, totalRevenue: number){
        const subject = `Daily Sales Report - ${new Date(). toLocaleDateString()}`;

        const text = `Hello,
         Here is a detailed summary of today's sales:
-Total sales: ${totalSales}
-Total Revenue: MKW ${totalRevenue.toLocaleString()}
         
         `;

         return this.sendEmail(adminEmail, subject, text);
    }
    async sendEmailWithAttachment(to: string, subject: string, text: string, pdfBuffer: Buffer, filename: string) {
        try {
            const senderEmail = this.configService.get<string>('EMAIL_USER');
            const info = await this.transporter.sendMail({
                from: `"ShopTrack" <${senderEmail}>`,
                to: to,
                subject: subject,
                text: text,
                attachments: [
                    {
                        filename: filename,
                        content: pdfBuffer,
                        contentType: 'application/pdf',
                    },
                ],
            });

            console.log('Email with attachment sent:', info.response);
            return info;
        } catch (error) {
            console.error('Error sending email with attachment:', error);
            throw error;
        }
    }
}
