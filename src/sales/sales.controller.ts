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

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@ApiTags('sales')
@ApiBearerAuth()
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



  @Get()
  findAll(@Req() req) {
    return this.salesService.findAll(req.user);
  }



  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.salesService.remove(id);
  }
}