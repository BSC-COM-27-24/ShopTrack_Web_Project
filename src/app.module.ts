import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ProductsModule } from './products/products.module';
import { ProdctsService } from './prodcts/prodcts.service';

@Module({
  imports: [

    ///SETTING THE DATABASE TO WORK 

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'oracle',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '1521'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        serviceName: config.get('DB_SERVICE_NAME'),
        entities: [User],
        synchronize: config.get('DB_SYNCHRONIZE') === 'true',
        logging: true
      })
    }),
    AuthModule, UsersModule, ProductsModule
  ],

  controllers: [AppController],
  providers: [AppService, ProdctsService],
})
export class AppModule { }
