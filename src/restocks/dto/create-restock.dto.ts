import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateRestockDto {
  @ApiProperty({
    description: 'The ID of the product to restock',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({
    description: 'The quantity to add to the stock',
    example: 50,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Cost per unit for this restock batch', example: 12.50 })
  @IsNumber()
  @IsPositive()
  unitCost: number;
}