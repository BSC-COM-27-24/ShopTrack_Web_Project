import { Injectable, BadRequestException } from '@nestjs/common';
import bcrypt from 'bcryptjs';


//define the user attributes

    export interface User{
        id: number;
        name: string;
        username: string;
        password: string;
        email : string;
        role : 'Admin' | 'Attendant';
    }
    
@Injectable()
export class UsersService {
    private users: User[] = [];
     
    

    //creating a user....

    async createUser(id: number, name:string, username: string, password: string, email: string, role : 'Admin'){

        //checking if they aleady exist

            if (this.users.find(user => user.email === email)){
                throw new BadRequestException('Email already exists');
            }

             if (this.users.find(user => user.username === username)){
                throw new BadRequestException('Username already exists');
            }

             if (this.users.find(user => user.role === role)){
                throw new BadRequestException('Admin already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            //a new user
            const newUser: User = {
                id: this.users.length + 1,
                name,
                username,
                password: hashedPassword,
                email,
                role
            }
            this.users.push(newUser);

            return newUser;
    }

    //SEARCHING FOR A USER

    findUserByEmail(email: string){
        return this.users.find(user => user.email === email);
    }


    findUserbyUsername(username: string){
        return this.users.find(user => user.username === username);

    }

    findUserbyRole(role : string){
        if (role === 'Admin' || role === 'Attendant'){
            return this.users.filter(user => user.role === role);
        }
        throw new BadRequestException('Invalid role');
    }

}
