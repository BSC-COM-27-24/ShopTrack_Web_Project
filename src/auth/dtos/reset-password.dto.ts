import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'a3f9bc12def456...', description: 'Reset token received via email or JSON response' })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token!: string;

  @ApiProperty({ example: 'MyNewPassword123', description: 'New password (min 8 characters)' })
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  newPassword!: string;
}
