import { Controller, Get, Post, Patch, Param, Body, ParseIntPipe, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @Roles('Admin', 'Attendant')
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or category' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productsService.findAll(search, category, page, limit);
  }

  @Get(':id')
  @Roles('Admin', 'Attendant')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Return the product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a product details' })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.' })
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @Patch(':id/deactivate')
  @Roles('Admin')
  @ApiOperation({ summary: 'Deactivate a product ' })
  @ApiResponse({ status: 200, description: 'The product has been disabled.' })
  disable(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.disable(id, req.user);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'The product has been deleted from database.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeOne(id);
  }
}

