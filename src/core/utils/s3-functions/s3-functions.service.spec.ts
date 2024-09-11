import { Test, TestingModule } from '@nestjs/testing';
import { S3FunctionsService } from './s3-functions.service';

describe('S3FunctionsService', () => {
  let service: S3FunctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3FunctionsService],
    }).compile();

    service = module.get<S3FunctionsService>(S3FunctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
