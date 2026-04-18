import { Controller, Post, Body, Delete, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    //SETUP FUNCTION
    @Post('setup')
    async setup(@Body() body: any) {
        return await this.authService.setup(body);
    }

    //LOGIN FUNCTION
    @Post('login')
    async login(@Body() body: any) {
        return await this.authService.login(body);
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