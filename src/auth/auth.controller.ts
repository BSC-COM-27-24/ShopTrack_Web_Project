import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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

    @Post('setup')
    @ApiOperation({ summary: 'Initial system setup' })
    @ApiResponse({ status: 201, description: 'First admin created successfully.' })
    async setup(@Body() createAdminDto: createAdminDto) {
        return await this.authService.setup(createAdminDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful, returns JWT.' })
    async login(@Body() loginDto: loginDto) {
        return await this.authService.login(loginDto);
    }

    @Post('forgot-password')
    @ApiOperation({
        summary: 'Request a password reset token',
        description: 'Generates a reset token and sends it to the user\'s email.',
    })
    @ApiResponse({ status: 200, description: 'Reset token generated.' })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return await this.authService.forgotPassword(dto.email);
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




