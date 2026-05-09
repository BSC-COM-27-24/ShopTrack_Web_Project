import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createAdminDto {

    //NAME
    @ApiProperty({ example: 'John Doe', description: 'The full name of the administrator' })
    @IsString()
    @IsNotEmpty({ message: 'Enter a name' })
    name: string;

    //USERNAME
    @ApiProperty({ example: 'administrator_user_new', description: 'The unique username of the account' })
    @IsString()
    @IsNotEmpty({ message: 'Enter a username' })
    @MinLength(8, { message: 'Username must be at least 15 characters long' })
    username: string;

    //EMAIL
    @ApiProperty({ example: 'admin@example.com', description: 'The email address of the administrator' })
    @IsEmail()
    @IsNotEmpty({ message: 'Enter an email' })
    email: string;

    //PASSWORD
    @ApiProperty({ example: 'strong_password_123', description: 'The password for the account' })
    @IsString()
    @IsNotEmpty({ message: 'Enter a password' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}