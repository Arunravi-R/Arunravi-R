import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MongoAbility } from '@casl/ability';
import {
  CaslAbilityFactory,
  PERMISSION_CHECKER_KEY,
  RequiredPermission,
} from './casl-ability.factory/casl-ability.factory';
import { ValUser } from 'src/core/variables/interfaces';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("entering --> function-Name:",context.getHandler(),context.getHandler().name,context.getClass().name);
   
    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(
        PERMISSION_CHECKER_KEY,
        context.getHandler(),
      ) || [];

    const req = context.switchToHttp().getRequest<Request>();
    console.log('permissions', requiredPermissions);

    const user = req.user as ValUser;
    const ability = await this.abilityFactory.createForUser(user);

    return requiredPermissions.every((permission) =>
      this.isAllowed(ability, permission),
    );
  }

  private isAllowed(
    ability: MongoAbility,
    permission: RequiredPermission,
  ): boolean {
    console.log('isallowed', ability.can(...permission));
    return ability.can(...permission);
  }
}
