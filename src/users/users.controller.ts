import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // GET /api/v1/users - List all users
    @Get()
    async findAll() {
        const users = await this.usersService.findAll();
        return {
            status: 'success',
            data: users
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

    // POST /api/v1/users - Create attendant account
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto) {
        // Only allow creating Attendant accounts via this endpoint
        if (createUserDto.role === 'Admin') {
            throw new BadRequestException('Admin account must be created through setup endpoint');
        }
        
        const user = await this.usersService.createUser(
            createUserDto.name,
            createUserDto.username,
            createUserDto.password,
            createUserDto.email,
            createUserDto.role
        );
        
        const { password, ...userWithoutPassword } = user;
        return {
            status: 'success',
            message: 'Attendant account created successfully',
            data: userWithoutPassword
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
        message: result.message 
        }
    
}