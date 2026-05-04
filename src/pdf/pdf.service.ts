import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');

@Injectable()
export class PdfService {
  async generateReceiptPdf(saleId: number, productName: string, quantity: number, totalAmount: number, soldBy: string): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Simple Receipt Structure
      doc.fontSize(20).text('Sales Receipt', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Receipt ID: ${saleId}`);
      doc.text(`Date: ${new Date().toLocaleString()}`);
      doc.text(`Attendant: ${soldBy}`);
      doc.moveDown();
      
      doc.text('----------------------------------------------------');
      doc.moveDown();
      doc.text(`Product: ${productName}`);
      doc.text(`Quantity: ${quantity}`);
      doc.moveDown();
      doc.text('----------------------------------------------------');
      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: MKW ${totalAmount.toLocaleString()}`, { align: 'right' });

      doc.end();
    });
  }
}
