import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateRestockDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  productId!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}