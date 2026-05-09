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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }


  @Post()
  @Roles('Admin', 'Attendant')
  @ApiOperation({ summary: 'Record a new sale' })
  recordSale(
    @Req() req: any,
    @Body() createSaleDto: CreateSaleDto,
  ) {
    return this.salesService.recordSale(
      req.user,
      createSaleDto.productId,
      createSaleDto.quantity,
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
}