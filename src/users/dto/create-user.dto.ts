import { IsString, IsEmail, IsIn, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {


    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'Add a username' })
    @MinLength(8)
    username!: string;

    @IsString()
    @IsNotEmpty({ message: 'Input a password' })
    @MinLength(8)
    password!: string;

    @IsEmail()
    @IsNotEmpty({ message: 'Add a valid email address' })
    email!: string;

    @IsString()
    @IsIn(['Admin', 'Attendant'])
    role!: 'Admin' | 'Attendant';
}