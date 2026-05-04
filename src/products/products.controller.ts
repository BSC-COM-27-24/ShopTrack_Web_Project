import { Controller, Get, Post, Param, Body, ParseIntPipe, Delete, UseGuards, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles('Admin', 'Attendant')
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Attendant')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles('Admin')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  
  @Patch()
  @Roles('Admin')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto){
    return this.productsService.update(+id,updateProductDto);
  }
  @Delete()
  @Roles('Admin')
  deleteAll() {
    return this.productsService.deleteAll();
  }

  @Delete(':id')
  @Roles('Admin')
 remove(@Param('id') id: string) {
  return this.productsService.disable(+id);
}

  @Delete(':id')
  @Roles('Admin')
  removeOne(@Param('id') id: string){
    return this.productsService.removeOne(+id);
  }
}

