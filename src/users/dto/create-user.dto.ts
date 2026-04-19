import { IsString, IsEmail, IsIn, MinLength, IsNotEmpty } from 'class-validator';

// This class defines what data we expect when creating a user
export class CreateUserDto {
    
    // @IsString() - validates that this field must be a string
    // @IsNotEmpty() - ensures the field is not empty
    @IsString()
    @IsNotEmpty()
    name!: string;  // User's full name

    @IsString()
    @IsNotEmpty()
    @MinLength(3)  // Minimum 3 characters for username
    username!: string;  // Unique username for login

    @IsString()
    @IsNotEmpty()
    @MinLength(6)  // Minimum 6 characters for password security
    password!: string;  // User's password (will be hashed)

    @IsEmail()  // Validates that this is a proper email format
    @IsNotEmpty()
    email!: string;  // User's email address

    @IsString()
    @IsIn(['Admin', 'Attendant'])  // Only allows these two values
    role!: 'Admin' | 'Attendant';  // User role in the system
}