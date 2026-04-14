import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    register(name: string, username: string, email: string, password: string) {
        throw new Error('Method not implemented.');
    }
    UsersService: any;
    async setup(body: any) {
  const adminExists = this.UsersService.findUserbyRole('Admin');

  if (adminExists.length > 0) {
    throw new BadRequestException('Admin already exists');
  }

  const user = await this.UsersService.createUser({
    name: body.name,
    username: body.username,
    password: body.password,
    email: body.email,
    role: 'Admin',
  });

 // return this.login(user); // optional
}
}