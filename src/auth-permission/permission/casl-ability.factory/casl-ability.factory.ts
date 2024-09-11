import { createMongoAbility, MongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { ValUser } from 'src/core/variables/interfaces';

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export enum ControllerObjects {
  TEST = 'testController',
}

export type AppAbility = MongoAbility<[PermissionAction, string]>;

export type RequiredPermission = [PermissionAction, string];
export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';
export const CheckPermissions = (
  ...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, params);

@Injectable()
export class CaslAbilityFactory {
  constructor(private authService: AuthService) {}

  async createForUser(user: ValUser): Promise<MongoAbility> {
    // const roleId = Role.USER;
    // const dbPermissions = await this.authService.getAllUserPermission(
    //   roleId,
    // );
    const dbPermissions = await this.authService.getAllUserPermission(
      user.roleId,
    );
    console.log(dbPermissions);

    const ability =
      createMongoAbility<[PermissionAction, string]>(dbPermissions);
    return ability;
  }
}
