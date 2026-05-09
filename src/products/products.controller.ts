import { Controller, Get, Post, Param, Body, ParseIntPipe, Delete, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @Roles('Admin', 'Attendant')
  @ApiOperation({ summary: 'Get all products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Attendant')
  @ApiOperation({ summary: 'Get a product by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  
  @Patch(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a product' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto){
    return this.productsService.update(+id,updateProductDto);
  }
  @Delete()
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete all products' })
  deleteAll() {
    return this.productsService.deleteAll();
  }

  @Patch(':id/disable')
  @Roles('Admin')
  @ApiOperation({ summary: 'Disable a product' })
 remove(@Param('id') id: string) {
  return this.productsService.disable(+id);
}


  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a product by ID' })
  removeOne(@Param('id') id: string){
    return this.productsService.removeOne(+id);
  }
}

