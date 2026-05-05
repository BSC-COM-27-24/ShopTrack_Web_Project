import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import * as express from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { SalesService } from './sales.service';

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales') 
export class SalesController {
  constructor(private readonly salesService: SalesService) {}


  @Post()
  @Roles('Admin', 'Attendant')
  @ApiOperation({ summary: 'Record a new sale' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
        quantity: { type: 'number' },
      },
    },
  })
  recordSale(
    @Req() req: any,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.salesService.recordSale(
      req.user,
      body.productId,
      body.quantity,
    );
  }


  @Get()
  @Roles('Admin', 'Attendant')
  @ApiOperation({ summary: 'Get all sales (filtered by user if not Admin)' })
  findAll(@Req() req: any) {
    return this.salesService.findAll(req.user);
  }


  @Get('summary')
  @Roles('Admin')
  @ApiOperation({ summary: 'Get sales summary (Admin only)' })
  summary() {
    return this.salesService.summary();
  }


  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a sale by ID' })
  remove(@Param('id') id: number) {
    return this.salesService.remove(id);
  }

  @Post('daily-email')
  @Roles('Admin')
  @ApiOperation({ summary: 'Trigger daily sales report email' })
  async sendDailyEmail() {
    return this.salesService.sendDailyReport();
  }

  @Get('receipt/:id')
  @Roles('Admin', 'Attendant')
  @ApiOperation({ summary: 'Download a receipt PDF' })
  async downloadReceipt(
    @Param('id') id: number,
    @Res() res: express.Response,
  ) {
    const { buffer, sale } = await this.salesService.getReceiptBuffer(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=receipt-${sale.id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}