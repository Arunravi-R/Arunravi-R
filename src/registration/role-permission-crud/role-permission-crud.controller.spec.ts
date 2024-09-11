import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionCrudController } from './role-permission-crud.controller';

describe('RolePermissionCrudController', () => {
  let controller: RolePermissionCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolePermissionCrudController],
    }).compile();

    controller = module.get<RolePermissionCrudController>(RolePermissionCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
