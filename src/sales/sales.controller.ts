import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Req,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SalesService } from './sales.service';

@Controller('sales')
@UseGuards(AuthGuard('jwt'))
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  recordSale(
    @Req() req,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.salesService.recordSale(req.user, body.productId, body.quantity);
  }

  @Get('summary')
  summary() {
    return this.salesService.summary();
  }

  @Get('receipt')
  getReceipt(@Query('saleId') saleId: number, @Req() req) {
    return this.salesService.getReceipt(saleId, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.salesService.findAll(req.user);
  }

  @Post('daily-email')
  sendDailyEmail(@Body() body: { adminEmail: string }) {
    return this.salesService.sendDailySalesEmail(body.adminEmail);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.salesService.remove(id);
  }
}