import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class loginDto {

    //USERNAME
    @IsString()
    @IsNotEmpty({ message: 'Enter a username' })
    @MinLength(15, { message: 'Username must be at least 15 characters long' })
    username: string;

    //PASSWORD
    @IsString()
    @IsNotEmpty({ message: 'Enter a password' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}