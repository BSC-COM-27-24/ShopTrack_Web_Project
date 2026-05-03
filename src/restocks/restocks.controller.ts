import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RestocksService } from './restocks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('restocks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestocksController {
  constructor(private readonly restocksService: RestocksService) {}

  // GET /api/v1/restocks
  @Get()
  @Roles('Admin', 'Attendant')
  findAll() {
    return this.restocksService.findAll();
  }

  // POST /api/v1/restocks
  @Post()
  @Roles('Admin', 'Attendant')
  create(@Body() body: { productId: number; quantity: number }) {
    return this.restocksService.create(body.productId, body.quantity);
  }
}