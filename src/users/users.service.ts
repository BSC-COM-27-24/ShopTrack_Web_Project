import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';   // ← Use * as bcrypt (not default import)

export interface User {
    id: number;
    name: string;
    username: string;
    password: string;
    email: string;
    role: 'Admin' | 'Attendant';
}

@Injectable()
export class UsersService {
    private users: User[] = [];

    //creating a user

    async createUser(
        name: string,
        username: string,
        password: string,
        email: string,
        role: 'Admin' | 'Attendant'
    ): Promise<User> {

        // Check if email exists
        if (this.users.find(user => user.email === email)) {
            throw new BadRequestException('Email already exists');
        }

        // Check if username exists
        if (this.users.find(user => user.username === username)) {
            throw new BadRequestException('Username already exists');
        }

        // Only allow ONE Admin
        if (role === 'Admin' && this.users.some(user => user.role === 'Admin')) {
            throw new BadRequestException('Admin already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: this.users.length + 1,
            name,
            username,
            password: hashedPassword,
            email,
            role
        };

        this.users.push(newUser);
        return newUser;
    }

    // finding users using emails
    findUserByEmail(email: string) {
        return this.users.find(user => user.email === email);
    }

    //finding users via username
    findUserbyUsername(username: string) {
        return this.users.find(user => user.username === username);
    }

    //finding by role
    findUserbyRole(role: 'Admin' | 'Attendant'): User[] {
        return this.users.filter(user => user.role === role);
    }
}