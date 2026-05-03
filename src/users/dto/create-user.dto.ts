import { IsString, IsEmail, IsIn, MinLength, IsNotEmpty } from 'class-validator';

// This class defines what data we expect when creating a user
export class CreateUserDto {
    
  
    @IsString()
    @IsNotEmpty()
    name!: string;  // User's full name

    @IsString()
    @IsNotEmpty({message: 'Add a username'})
    @MinLength(15)  // Minimum 15 characters for username
    username!: string;  // Unique username for login

    @IsString()
    @IsNotEmpty({message: 'Input a password'})
    @MinLength(8)  // Minimum 8 characters for password security
    password!: string;  // User's password (will be hashed)

    @IsEmail()  // Validates that this is a proper email format
    @IsNotEmpty({message: 'Add a valid email address'})
    email!: string;  // User's email address

    @IsString()
    @IsIn(['Admin', 'Attendant'])  // Only allows these two values
    role!: 'Admin' | 'Attendant';  // User role in the system
}