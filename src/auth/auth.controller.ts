import { Controller, Post, Get, Body, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { loginDto } from './dtos/login.dto';
import { createAdminDto } from './dtos/create-admin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    //STATUS FUNCTION

    @Get('status')
    @ApiOperation({ summary: 'Check the system status' })
    async status() {
        return await this.authService.status();
    }

    //SETUP FUNCTION
    @Post('setup')
    @ApiOperation({ summary: 'Initial administrator setup' })
    async setup(@Body() createAdminDto: createAdminDto) {
        return await this.authService.setup(createAdminDto);
    }

    //LOGIN FUNCTION
    @Post('login')
    @ApiOperation({ summary: 'User login' })
    async login(@Body() loginDto: loginDto) {
        return await this.authService.login(loginDto);
    }

}



}
