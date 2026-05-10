import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode, HttpStatus, BadRequestException, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
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
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, username or email' })
  @ApiQuery({ name: 'role', required: false, enum: ['Admin', 'Attendant'] })
  async findAll(@Query() filters: UserFilterDto) {
    const users = await this.usersService.findAll(filters);
    // Remove passwords from all users before sending
    const safeUsers = users.map(({ password, ...rest }) => rest);
    return {
      status: 'success',
      count: safeUsers.length,
      data: safeUsers,
    };
  }

    // GET /api/v1/users/:id - Get user details by id
    @Get(':id')
    @Roles('Admin')
    @ApiOperation({ summary: 'Get user details by ID' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findById(id);
        return {
            status: 'success',
            data: user
        };
    }

  @Post()
  @HttpCode(HttpStatus.CREATED)
   @Roles('Admin')
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
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

    // PATCH /api/v1/users/:id - Update user details
    @Patch(':id')
     @Roles('Admin')
    @ApiOperation({ summary: 'Update user details' })
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
    @Roles('Admin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'User deleted.' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        const result = await this.usersService.deleteUser(id);
        return {
            status: 'success',
            message: result
        };
    }
}
