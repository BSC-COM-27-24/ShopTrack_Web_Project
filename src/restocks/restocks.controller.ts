import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RestocksService } from './restocks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateRestockDto } from './dto/create-restock.dto';

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
  create(@Body() createRestockDto: CreateRestockDto) {
    return this.restocksService.create(createRestockDto.productId, createRestockDto.quantity);
  }
}