import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }


  //FIRST TIME SETUP

  async setup(body: { name: string; username: string; password: string; email: string }) {
    if (!body.name || !body.username || !body.email || !body.password) {
      throw new BadRequestException('All fields are required: name, username, email, password');
    }

    const adminExists = this.usersService.findUserbyRole('Admin');
    if (adminExists.length > 0) {
      throw new BadRequestException('Admin already exists');
    }

    const user = await this.usersService.createUser(
      body.name,
      body.username,
      body.password,
      body.email,
      'Admin'
    );

    return {
      message: 'Admin account created successfully',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  //LOGIN FUNCTION
  async login(body: any) {
    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }

    const user = this.usersService.findUserbyUsername(body.username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

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
        role: user.role
      }
    };
  }
}