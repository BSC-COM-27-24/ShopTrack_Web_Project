import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) { }

  async setup(body: { name: string; username: string; password: string; email: string }) {
    // Check if admin already exists
    const adminExists = this.usersService.findUserbyRole('Admin');

    if (adminExists.length > 0) {
      throw new BadRequestException('Admin already exists');
    }

    // Create the admin 
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
}