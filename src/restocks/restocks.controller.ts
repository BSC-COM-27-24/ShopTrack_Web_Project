import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RestocksService } from './restocks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateRestockDto } from './dto/create-restock.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('restocks')
@ApiBearerAuth()
@Controller('restocks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestocksController {
  constructor(private readonly restocksService: RestocksService) {}

  @Get()
  @Roles('Admin', 'Attendant') // both can view
  @ApiOperation({ summary: 'Retrieve all restock history' })
  @ApiResponse({ status: 200, description: 'Return all restocks.' })
  findAll() {
    return this.restocksService.findAll();
  }

  @Post()
  @Roles('Admin', 'Attendant') // BOTH can create restocks now
  @ApiOperation({ summary: 'Record a new restock' })
  @ApiResponse({ status: 201, description: 'Restock recorded successfully.' })
  create(@Req() req: any, @Body() createRestockDto: CreateRestockDto) {
    return this.restocksService.create(req.user, createRestockDto);
  }
}