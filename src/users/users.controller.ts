import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles('Admin')
  @ApiOperation({ summary: 'List all users (Admin only)' })
  @ApiQuery({ name: 'role', required: false, enum: ['Admin', 'Attendant'], description: 'Filter users by role' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll(@Query('role') role?: 'Admin' | 'Attendant') {
    const users = await this.usersService.findAll(role);
    const safeUsers = users.map(({ password, resetToken, resetTokenExpiry, ...rest }) => rest);
    return {
      status: 'success',
      count: safeUsers.length,
      data: safeUsers,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({ status: 200, description: 'Return user details.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    return {
      status: 'success',
      data: user
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(
      createUserDto.name,
      createUserDto.username,
      createUserDto.password,
      createUserDto.email,
      createUserDto.role,
    );

    const { password, ...userWithoutPassword } = user;
    return {
      status: 'success',
      message: `${user.role} account created successfully`,
      data: userWithoutPassword,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.usersService.updateUser(id, updateUserDto);
    return {
      status: 'success',
      message: 'User updated successfully',
      data: user
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'User deleted.' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usersService.deleteUser(id);
    return {
      status: 'success',
      message: result
    };
  }
}
