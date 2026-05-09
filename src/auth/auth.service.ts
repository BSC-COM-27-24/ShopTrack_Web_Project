import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email/email.service';
import { loginDto } from './dtos/login.dto';
import { createAdminDto } from './dtos/create-admin.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }


  //ACCOUNT / ADMIN EXISTENCE CHECK

  async status() {
    const admins = await this.usersService.findUserbyRole('Admin');
    const setupCompleted = admins.length > 0;

    return {
      setupCompleted: setupCompleted,
      message: setupCompleted
        ? 'Admin account already exists. You can now login.'
        : 'No admin account found. Please run the setup endpoint first.',
      adminCount: admins.length
    };
  }

  //FIRST TIME SETUP

  async setup(createAdminDto: createAdminDto) {
    if (!createAdminDto.name || !createAdminDto.username || !createAdminDto.email || !createAdminDto.password) {
      throw new BadRequestException(
        'All fields are required: name, username, email, password',
      );
    }

    const adminExists = await this.usersService.findUserbyRole('Admin');
    if (adminExists.length > 0) {
      throw new BadRequestException('Admin already exists');
    }

    const user = await this.usersService.createUser(
      createAdminDto.name,
      createAdminDto.username,
      createAdminDto.password,
      createAdminDto.email,
      'Admin',
    );

    return {
      message: 'Admin account created successfully',
    };
  }

  //LOGIN FUNCTION
  async login(loginDto: loginDto) {
    if (!loginDto.username || !loginDto.password) {
      throw new BadRequestException('Username and password are required');
    }

    const user = await this.usersService.findUserbyUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
    };
  }

  //FORGOT PASSWORD
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {

      // Return success message even if email not found to prevent user enumeration
      return {
        message: 'If that email exists in our system, a reset token has been sent.',
      };
    }

    const rawToken = crypto.randomBytes(24).toString('hex');
    const hashedToken = await bcrypt.hash(rawToken, 10);
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.usersService.saveResetToken(user.id, hashedToken, expiry);

    const emailText = `Hello ${user.name},

You requested a password reset for your ShopTrack account.

Your reset token is:

  ${rawToken}

Use this token on the POST /auth/reset-password endpoint along with your new password.

This token expires in 1 hour. If you did not request this, please ignore this email.

— ShopTrack System`;

    this.emailService.sendEmail(user.email, 'ShopTrack — Password Reset Token', emailText)
      .catch(err => console.error('Failed to send password reset email:', err));

    return {
      token: rawToken,
    };
  }


  //RESET PASSWORD FUNCTION
  async resetPassword(token: string, newPassword: string) {

    const allUsers = await this.usersService.findAll();
    const usersWithToken = allUsers.filter(u => u.resetToken !== null);

    let matchedUser: typeof allUsers[0] | null = null;

    for (const u of usersWithToken) {
      const isMatch = await bcrypt.compare(token, u.resetToken!);
      if (isMatch) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    if (!matchedUser.resetTokenExpiry || matchedUser.resetTokenExpiry < new Date()) {
      await this.usersService.clearResetToken(matchedUser.id);
      throw new BadRequestException('Reset token has expired. Please request a new one.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(matchedUser.id, hashedPassword);

    await this.usersService.clearResetToken(matchedUser.id);

    return {
      message: 'Password reset successfully. You can now login with your new password.',
    };
  }
}
