import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dtos/login.dto';
import { createAdminDto } from './dtos/create-admin.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }


  //ACCOUNT / ADMIN EXTSISTENCE CHECK

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
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
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
      message: 'Login successful',
      access_token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  //LOGOUT FUNCTION

  async logout() {
    return 'Logout successfull';
  }
}
