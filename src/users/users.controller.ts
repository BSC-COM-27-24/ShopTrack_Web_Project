import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode, HttpStatus, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

     // GET /api/v1/users - List all users
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    // Remove passwords from all users before sending
    const safeUsers = users.map(({ password, ...rest }) => rest);
    return {
      status: 'success',
      data: safeUsers,
    };
  }

    // GET /api/v1/users/:id - Get user details by id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findById(id);
        return {
            status: 'success',
            data: user
        };
    }

   // POST /api/v1/users - Create a user (Admin or Attendant)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    
    const user = await this.usersService.createUser(
      createUserDto.name,
      createUserDto.username,
      createUserDto.password,
      createUserDto.email,
      createUserDto.role, // can be 'Admin' or 'Attendant'
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

    // DELETE /api/v1/users/:id - Delete user
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id', ParseIntPipe) id: number) {
        const result = await this.usersService.deleteUser(id);
      return {
     status: 'success',
        message: result  
        };
    }

}
