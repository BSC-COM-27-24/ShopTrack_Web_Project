import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ description: 'The name of the product', example: 'Widget' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The price of the product', example: 19.99 })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiPropertyOptional({ description: 'The category of the product', example: 'Electronics' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiProperty({ description: 'The initial stock quantity', example: 100 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

}