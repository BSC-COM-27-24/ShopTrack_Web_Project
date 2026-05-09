import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginDto {

    //USERNAME
    @ApiProperty({ example: 'administrator_user', description: 'The unique username of the account' })
    @IsString()
    @IsNotEmpty({ message: 'Enter a username' })
    @MinLength(8, { message: 'Username must be at least 15 characters long' })
    username: string;

    //PASSWORD
    @ApiProperty({ example: 'strong_password_123', description: 'The password for the account' })
    @IsString()
    @IsNotEmpty({ message: 'Enter a password' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}