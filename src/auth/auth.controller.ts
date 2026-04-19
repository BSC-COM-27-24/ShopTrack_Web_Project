import { Controller, Post, Body, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { loginDto } from './dtos/login.dto';
import { createAdminDto } from './dtos/create-admin.dto';

@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    //STATUS FUNCTION

    @Post('status')

    async status() {
        return await this.authService.status();
    }

    //SETUP FUNCTION
    @Post('setup')
    async setup(@Body() createAdminDto: createAdminDto) {
        return await this.authService.setup(createAdminDto);
    }

    //LOGIN FUNCTION
    @Post('login')
    async login(@Body() loginDto: loginDto) {
        return await this.authService.login(loginDto);
    }

    //TEMPORARY DATA CLEAR WHILE THE DATABASE IS BEING WORKED ON
    @Delete('clear')
    clearData() {
        return this.usersService.clearAllData();
    }

    //LOGOUT FUNCTION

    @Post('logout')
    async logout() {
        return this.authService.logout();
    }


}
