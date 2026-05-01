import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',        // change to 'mysql' or 'sqlite' if needed
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'yourpassword',
      database: 'shop_truck',
      autoLoadEntities: true,  // picks up all forFeature() entities automatically
      synchronize: true,       // turn OFF in production
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    SalesModule,               // ← your module goes here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}