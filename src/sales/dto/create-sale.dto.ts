import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({ description: 'The ID of the product being sold', example: 1 })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ description: 'The quantity of the product being sold', example: 5 })
  @IsInt()
  @Min(1)
  quantity: number;
}
