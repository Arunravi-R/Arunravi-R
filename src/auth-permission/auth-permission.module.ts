import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './permission/casl-ability.factory/casl-ability.factory';
import { PermissionGuard } from './permission/permission.guard';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ControllerActions,
  ControllerPermission,
  Controllers,
  RolePermissionMapping,
  Roles,
} from './entities/role-access.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Roles,
      RolePermissionMapping,
      ControllerPermission,
      ControllerActions,
      Controllers,
    ]),
 
  ],
  providers: [CaslAbilityFactory, AuthService, PermissionGuard],
  exports: [CaslAbilityFactory, PermissionGuard],
})
export class AuthPermissionModule {}
