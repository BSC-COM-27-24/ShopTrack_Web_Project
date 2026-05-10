import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsInt, Min } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({
    description: 'The ID of the product being sold',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'The quantity of the product being sold',
    example: 2,
  })
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
