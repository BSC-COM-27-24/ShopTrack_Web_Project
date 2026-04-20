import { IsString, IsEmail, IsIn, IsOptional, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    //@IsOptional()
    @IsString()
    @MinLength(15)
    username?: string;

    //@IsOptional()
    @IsString()
    @IsNotEmpty({message: 'Enter a password'})
    @MinLength(8)
    password?: string;

   // @IsOptional()
    @IsEmail()
    email?: string;

   // @IsOptional()
    @IsString()
    @IsIn(['Admin', 'Attendant'])
    role?: 'Admin' | 'Attendant';
}
