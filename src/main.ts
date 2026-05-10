import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('ShopTrack API')
    .setDescription('The ShopTrack Inventory Management API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication and Initial Setup')
    .addTag('users', 'Staff and Admin Management')
    .addTag('products', 'Inventory & Product Catalog')
    .addTag('sales', 'Sales Tracking & Summaries')
    .addTag('restocks', 'Inventory Restocking & Cost Tracking')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();