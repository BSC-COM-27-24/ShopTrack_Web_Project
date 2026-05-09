import { Controller, Post, Get, Body, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { loginDto } from './dtos/login.dto';
import { createAdminDto } from './dtos/create-admin.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

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

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    async login(@Body() loginDto: loginDto) {
        return await this.authService.login(loginDto);
    }

}


    @Post('reset-password')
    @ApiOperation({
        summary: 'Reset password using a token',
        description: 'Update password using the token received via email.',
    })
    @ApiResponse({ status: 200, description: 'Password reset successful.' })
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return await this.authService.resetPassword(dto.token, dto.newPassword);
    }
}




