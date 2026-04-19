import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs'; // ← Use * as bcrypt (not default import)

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }


  //CREATING A USER FOR THE FIRST TIME

  async createUser(
    name: string,
    username: string,
    password: string,
    email: string,
    role: 'Admin' | 'Attendant',
  ): Promise<User> {

    // Check if email already exists
    const emailExists = await this.usersRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    // Check if username already exists
    const usernameExists = await this.usersRepository.findOne({ where: { username } });
    if (usernameExists) {
      throw new BadRequestException('Username already exists');
    }

    // Only allow ONE Admin
    if (role === 'Admin') {
      const adminExists = await this.usersRepository.findOne({ where: { role: 'Admin' } });
      if (adminExists) {
        throw new BadRequestException('Admin already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = this.usersRepository.create({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });

    return await this.usersRepository.save(newUser);

  }
  async findUserbyUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async findUserbyRole(role: 'Admin' | 'Attendant'): Promise<User[]> {
    return await this.usersRepository.find({ where: { role } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async clearAllData() {
    await this.usersRepository.delete({});
    return {
      message: 'All users have been cleared. You can now create a new admin.',
    };
  }
}
