import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestockDto {
  @ApiProperty({ description: 'The ID of the product to restock', example: 1 })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ description: 'Quantity added to stock', example: 50 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Cost per unit for this restock batch', example: 12.50 })
  @IsNumber()
  @IsPositive()
  unitCost: number;
}