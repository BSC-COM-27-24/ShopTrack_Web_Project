import { IsNotEmpty, IsOptional, IsNumber, IsString ,IsInt} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsNumber()
    @IsInt()
    @IsNotEmpty()
    price?: number;

    @IsString()
    @IsOptional()
    category?: string;

    @IsNumber()
    @IsNotEmpty()
    quantity?: number;

}