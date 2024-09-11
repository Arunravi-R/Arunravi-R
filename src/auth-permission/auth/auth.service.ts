import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionAction } from '../permission/casl-ability.factory/casl-ability.factory';
import {
  ControllerActions,
  ControllerPermission,
  Controllers,
  RolePermissionMapping,
} from '../entities/role-access.entity';

interface UserPermissions {
  action: PermissionAction;
  subject: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RolePermissionMapping)
    private rolePermissionMappingRepo: Repository<RolePermissionMapping>,
  ) {}

  async getAllUserPermission(roleId: string): Promise<UserPermissions[]> {
    return await this.rolePermissionMappingRepo
      .createQueryBuilder('rpm')
      .select('ca.name as action,c.name as subject')
      .innerJoin(ControllerPermission, 'cp', 'cp.id = rpm.permissionId')
      .innerJoin(ControllerActions, 'ca', 'ca.id = cp.actionId')
      .innerJoin(Controllers, 'c', 'c.id = cp.controllerId')
      .where('rpm.roleId = :roleId', { roleId })
      .getRawMany<UserPermissions>();
  }
}
