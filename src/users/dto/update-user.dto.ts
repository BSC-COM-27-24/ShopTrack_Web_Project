import { IsString, IsEmail, IsIn, IsOptional, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(10)
    username?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)  // Removed @IsNotEmpty() because @MinLength(8) already ensures not empty if present
    password?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @IsIn(['Admin', 'Attendant'])
    role?: 'Admin' | 'Attendant';
}
