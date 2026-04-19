import {IsNotEmpty,IsOptional,IsNumber,IsString} from 'class-validator';

export class CreateProductDto{
    @IsString
    @IsNotEmpty
    name?: string;

    @IsNumber
    @IsNotEmpty
    price?: number;

    @IsString
    @IsOptional
    category?: string;

    @IsNumber
    @IsNotEmpty
    quantity?: number;

}