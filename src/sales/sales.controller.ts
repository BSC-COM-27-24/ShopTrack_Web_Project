import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';

import { SalesService } from './sales.service';

@Controller('sales') // ✅ FIXED (important)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // =========================
  // CREATE SALE
  // =========================
  @Post()
  recordSale(
    @Body() body: { productId: number; quantity: number },
  ) {
    // temporary user (since no auth module yet)
    const fakeUser = {
      id: 1,
      username: 'test',
      role: 'Admin',
    } as any;

    return this.salesService.recordSale(
      fakeUser,
      body.productId,
      body.quantity,
    );
  }

  // =========================
  // GET ALL SALES
  // =========================
  @Get()
  findAll() {
    const fakeUser = {
      id: 1,
      username: 'test',
      role: 'Admin',
    } as any;

    return this.salesService.findAll(fakeUser);
  }

  // =========================
  // SALES SUMMARY
  // =========================
  @Get('summary')
  summary() {
    return this.salesService.summary();
  }

  // =========================
  // DELETE SALE
  // =========================
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.salesService.remove(id);
  }
}