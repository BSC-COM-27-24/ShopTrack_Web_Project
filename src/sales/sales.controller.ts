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
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }


  @Post()
  @Roles('Admin', 'Attendant')
  @ApiOperation({ summary: 'Record a new sale' })
  @ApiResponse({ status: 201, description: 'Sale recorded successfully.' })
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
  @ApiOperation({ summary: 'Retrieve all sales' })
  @ApiResponse({ status: 200, description: 'Return all sales.' })
  findAll(@Req() req: any) {
    return this.salesService.findAll(req.user);
  }


  @Get('summary')
  @Roles('Admin')
  @ApiOperation({ summary: 'Get daily sales summary' })
  @ApiResponse({ status: 200, description: 'Return sales summary.' })
  summary() {
    return this.salesService.summary();
  }

}