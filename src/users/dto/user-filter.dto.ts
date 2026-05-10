import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UserFilterDto {
  @ApiPropertyOptional({ description: 'Search by name, username or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by role', enum: ['Admin', 'Attendant'] })
  @IsOptional()
  @IsString()
  @IsIn(['Admin', 'Attendant'])
  role?: 'Admin' | 'Attendant';
}
