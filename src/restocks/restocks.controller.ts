import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { RestocksService } from './restocks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('restocks')
@ApiBearerAuth()
@Controller('restocks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestocksController {
  constructor(private readonly restocksService: RestocksService) {}

  @Get()
  @Roles('Admin', 'Attendant') // both can view
  @ApiOperation({ summary: 'Get all restock records' })
  findAll() {
    return this.restocksService.findAll();
  }

  

  // POST /api/v1/restocks
  @Post()
  @Roles('Admin') // only Admin can create restocks
  @ApiOperation({ summary: 'Create a new restock record' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
        quantity: { type: 'number' },
      },
    },
  })
  create(@Body() body: { productId: number; quantity: number }) {
    return this.restocksService.create(body.productId, body.quantity);
  }
}