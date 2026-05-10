import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  // CREATE user (admin or attendant)
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });

    return await this.usersRepository.save(newUser);
  }

  // GET all users — optionally filter by role and search term
  async findAll(filters: UserFilterDto = {}): Promise<User[]> {
    const { role, search } = filters;
    const queryOptions: any = { where: {} };

    if (role) {
      queryOptions.where.role = role;
    }

    if (search) {
      const searchPattern = `%${search}%`;
      const searchCriteria = [
        { name: ILike(searchPattern) },
        { username: ILike(searchPattern) },
        { email: ILike(searchPattern) },
      ];

      if (role) {
        // If role is also provided, we need to ensure each search criteria also matches the role
        queryOptions.where = searchCriteria.map(criteria => ({
          ...criteria,
          role: role,
        }));
      } else {
        queryOptions.where = searchCriteria;
      }
    }

    return await this.usersRepository.find(queryOptions);
  }

  // SAVE reset token (hashed) + expiry on user record
  async saveResetToken(userId: number, hashedToken: string, expiry: Date): Promise<void> {
    await this.usersRepository.update(userId, {
      resetToken: hashedToken,
      resetTokenExpiry: expiry,
    });
  }

  // FIND user whose stored token matches (check done in service after fetch)
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  // CLEAR reset token after successful password reset
  async clearResetToken(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      resetToken: null,
      resetTokenExpiry: null,
    });
  }

  // UPDATE password directly (used after token validation)
  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.usersRepository.update(userId, { password: hashedPassword });
  }

  // GET user by ID
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // GET user by username (for login)
  async findUserbyUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  // GET users by role
  async findUserbyRole(role: 'Admin' | 'Attendant'): Promise<User[]> {
    return await this.usersRepository.find({ where: { role } });
  }

  // GET user by email
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  // GET user by ID (alias for findById)
  async findUserById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  // UPDATE user details
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id); // throws if not found

    // Check username uniqueness (if being changed)
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existing = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existing) {
        throw new BadRequestException('Username already taken');
      }
    }

    // Check email uniqueness (if being changed)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new BadRequestException('Email already in use');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    // Return without password 
    const { password, ...result } = updatedUser;
    return result as User;
  }

  // DELETE user
  async deleteUser(id: number): Promise<string> {
    const user = await this.findById(id); // throws if not found

    // Prevent deleting the last Admin
    if (user.role === 'Admin') {
      const adminCount = await this.usersRepository.count({
        where: { role: 'Admin' },
      });
      if (adminCount <= 1) {
        throw new BadRequestException(
          'Cannot delete the last administrator. The system must have at least one admin.',
        );
      }
    }

    await this.usersRepository.remove(user);
    return `User ${user.username} (ID: ${id}) has been deleted successfully`;
  }


  // Clear all users (used for resetting the system)
  async clearAllData() {
    await this.usersRepository.delete({});
    return {
      message: 'All users have been cleared. You can now create a new admin.',
    };
  }
}