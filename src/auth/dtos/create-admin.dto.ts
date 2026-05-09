import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class createAdminDto {

    //NAME
    @IsString()
    @IsNotEmpty({ message: 'Enter a name' })
    name: string;

    //USERNAME
    @IsString()
    @IsNotEmpty({ message: 'Enter a username' })
    @MinLength(8, { message: 'Username must be at least 15 characters long' })
    username: string;

    //EMAIL
    @IsEmail()
    @IsNotEmpty({ message: 'Enter an email' })
    email: string;

    //PASSWORD
    @IsString()
    @IsNotEmpty({ message: 'Enter a password' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;


}