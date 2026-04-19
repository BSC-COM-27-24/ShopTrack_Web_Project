import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
<<<<<<< HEAD
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
=======
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
>>>>>>> 85fbd7a0acf1c70ea0ac1ba5499f2336688f21a3
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
