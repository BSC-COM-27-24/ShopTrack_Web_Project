import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Auth } from 'typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
<<<<<<< HEAD
  imports: [TypeOrmModule.forFeature([User], 'auth'), AuthModule],
=======
  imports: [TypeOrmModule.forFeature([User])],
>>>>>>> 0b79af2ac8c3dee073dff007c5a254690de72cc2
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
