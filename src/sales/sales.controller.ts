import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { SalesService } from './sales.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales') // ✅ FIXED (important)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // =========================
  // CREATE SALE
  // =========================
  @Post()
  @Roles('Admin', 'Attendant')
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

  // =========================
  // GET ALL SALES
  // =========================
  @Get()
  @Roles('Admin', 'Attendant')
  findAll(@Req() req: any) {
    return this.salesService.findAll(req.user);
  }

  // =========================
  // SALES SUMMARY
  // =========================
  @Get('summary')
  @Roles('Admin')
  summary() {
    return this.salesService.summary();
  }

  // =========================
  // DELETE SALE
  // =========================
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: number) {
    return this.salesService.remove(id);
  }
}