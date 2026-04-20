import { Controller, Get, Post, Body } from '@nestjs/common';
import { RestocksService } from './restocks.service';

@Controller('restocks')
export class RestocksController {
  constructor(private readonly restocksService: RestocksService) {}

  // GET /api/v1/restocks
  @Get()
  findAll() {
    return this.restocksService.findAll();
  }

  // POST /api/v1/restocks
  @Post()
  create(@Body() body: { productId: number; quantity: number }) {
    return this.restocksService.create(body.productId, body.quantity);
  }
}