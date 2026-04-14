import { Test, TestingModule } from '@nestjs/testing';
import { RestocksService } from './restocks.service';

describe('RestocksService', () => {
  let service: RestocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestocksService],
    }).compile();

    service = module.get<RestocksService>(RestocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
