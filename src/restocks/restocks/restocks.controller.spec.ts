import { Test, TestingModule } from '@nestjs/testing';
import { RestocksController } from './restocks.controller';

describe('RestocksController', () => {
  let controller: RestocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestocksController],
    }).compile();

    controller = module.get<RestocksController>(RestocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
