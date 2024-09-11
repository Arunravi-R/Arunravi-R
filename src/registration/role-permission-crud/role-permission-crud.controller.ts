import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth-permission/permission/permission.guard';
import {
  CheckPermissions,
  ControllerObjects,
  PermissionAction,
} from 'src/auth-permission/permission/casl-ability.factory/casl-ability.factory';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RegistrationService } from '../registration.service';
import {
  ActionsDto,
  ControllersDto,
  PermissionDto,
  RoleDto,
  RolePermissionDto,
} from '../dto/create-registration.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('role-permission-crud')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class RolePermissionCrudController {
  constructor(
    private readonly registrationService: RegistrationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @CheckPermissions([PermissionAction.READ, 'testController'])
  @Post('saveRole')
  async saveRole(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() data: RoleDto,
  ) {
    try {
      await this.registrationService.saveRoles(data);

      this.logger.info(
        `| ${RolePermissionCrudController.name} | saveRole | 
        role added successfully`,
      );

      res.status(HttpStatus.OK).json({
        message: 'Role added',
      });
    } catch (error) {
      this.logger.error(
        ` | ${RolePermissionCrudController.name} | saveRole | 
        unable to add role | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'unable to add role',
      });
    }
  }

  @Post('saveControllerActions')
  @CheckPermissions([PermissionAction.CREATE, ControllerObjects.TEST])
  async saveUserRole(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() data: ActionsDto,
  ) {
    try {
      await this.registrationService.saveControllerActions(data);

      this.logger.info(
        `| ${RolePermissionCrudController.name} | saveControllerActions |
         Controller actions added successfully`,
      );
      res.status(HttpStatus.OK).json({
        message: 'controller Actions added',
      });
    } catch (error) {
      this.logger.error(
        ` | ${RolePermissionCrudController.name} | saveControllerActions | 
        Unable to add controller actions | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'unable to add controller actions',
      });
    }
  }

  @Post('saveController')
  @CheckPermissions([PermissionAction.CREATE, ControllerObjects.TEST])
  async saveScreenObjects(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() data: ControllersDto,
  ) {
    try {
      await this.registrationService.saveControllerObjects(data);

      this.logger.info(
        `| ${RolePermissionCrudController.name} | saveController | 
        controller added successfully`,
      );
      res.status(HttpStatus.OK).json({
        message: 'controller  added',
      });
    } catch (error) {
      this.logger.error(
        ` | ${RolePermissionCrudController.name} | saveController |
         unable to add controller | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'unable to add controller',
      });
    }
  }

  @Post('savePermission')
  @CheckPermissions([PermissionAction.CREATE, ControllerObjects.TEST])
  async savePermission(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() data: PermissionDto,
  ) {
    try {
      await this.registrationService.saveControllerPermission(data);

      this.logger.info(
        `| ${RolePermissionCrudController.name} | savePermission |
         Permission added successfully`,
      );
      res.status(HttpStatus.OK).json({
        message: 'permission added',
      });
    } catch (error) {
      this.logger.error(
        ` | ${RolePermissionCrudController.name} | savePermission | 
        Unable to add permission | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'unable to add permission',
      });
    }
  }

  @Post('saveRolePermission')
  @CheckPermissions([PermissionAction.CREATE, ControllerObjects.TEST])
  async saveRolePermission(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() data: RolePermissionDto,
  ) {
    try {
      await this.registrationService.saveUserPermission(data);

      this.logger.info(
        `| ${RolePermissionCrudController.name} | saveRolePermission |
         Role permission mapping added successfully`,
      );
      res.status(HttpStatus.OK).json({
        message: 'Role Permission added',
      });
    } catch (error) {
      this.logger.error(
        ` | ${RolePermissionCrudController.name} | saveRolePermission | 
        Unable to add role permission mapping | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'unable to add Role Permission',
      });
    }
  }
}
