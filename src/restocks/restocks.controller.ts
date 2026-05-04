import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RestocksService } from './restocks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('restocks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestocksController {
  constructor(private readonly restocksService: RestocksService) {}

  @Get()
  @Roles('Admin', 'Attendant') // both can view
  findAll() {
    return this.restocksService.findAll();
  }

  @Post()
  @Roles('Admin') // only Admin can create restocks
  create(@Body() body: { productId: number; quantity: number }) {
    return this.restocksService.create(body.productId, body.quantity);
  }
}