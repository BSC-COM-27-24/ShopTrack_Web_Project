import { Controller, Post, Body, Get } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  createSale(
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.salesService.createSale(productId, quantity);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }
}