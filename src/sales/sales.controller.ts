import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SalesService } from './sales.service';

@Controller('api/v1/sales')
@UseGuards(AuthGuard('jwt'))
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // ─── POST /api/v1/sales ──────────────────────────────────────────────────────
  // Both Admin and Attendant can record a sale
  // Body: { productId: number, quantity: number }
  @Post()
  recordSale(
    @Req() req,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.salesService.recordSale(req.user, body.productId, body.quantity);
  }

  // ─── GET /api/v1/sales ───────────────────────────────────────────────────────
  // Admin sees all sales; Attendant sees only their own
  @Get()
  findAll(@Req() req) {
    return this.salesService.findAll(req.user);
  }

  // ─── GET /api/v1/sales/summary ───────────────────────────────────────────────
  // Returns total number of sales and total revenue
  @Get('summary')
  summary() {
    return this.salesService.summary();
  }

  // ─── GET /api/v1/sales/receipt?saleId=1 ─────────────────────────────────────
  // Returns a formatted receipt for a specific sale
  @Get('receipt')
  getReceipt(@Query('saleId') saleId: number, @Req() req) {
    return this.salesService.getReceipt(saleId, req.user);
  }

  // ─── POST /api/v1/sales/daily-email ─────────────────────────────────────────
  // Admin manually triggers or cron triggers daily sales report email
  // Body: { adminEmail: string }
  @Post('daily-email')
  sendDailyEmail(@Body() body: { adminEmail: string }) {
    return this.salesService.sendDailySalesEmail(body.adminEmail);
  }
}