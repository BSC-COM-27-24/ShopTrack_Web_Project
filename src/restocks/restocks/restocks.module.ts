import { Module } from '@nestjs/common';
import { RestocksController } from './restocks.controller';

@Module({
  controllers: [RestocksController],
})
export class RestocksModule {}
