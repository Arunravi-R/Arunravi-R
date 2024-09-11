import {  Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/registration.entity';
import {
  ControllerActions,
  ControllerPermission,
  Controllers,
  RolePermissionMapping,
  Roles,
} from 'src/auth-permission/entities/role-access.entity';
import { UserOtpMapping } from './entities/registration.entity';
import { AuthPermissionModule } from 'src/auth-permission/auth-permission.module';
import { RolePermissionCrudController } from './role-permission-crud/role-permission-crud.controller';
import { JwtStrategyService } from 'src/auth-permission/auth/jwt-strategy/jwt-strategy.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/core/utils/email/email.service';
import { CommunicationService } from 'src/utils/communication/communication.service';
import { default as config} from '../jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Roles,
      RolePermissionMapping,
      ControllerPermission,
      ControllerActions,
      Controllers,
      UserOtpMapping
    ]),
    AuthPermissionModule,
    JwtModule.register({
      secret: config.jwt.secretOrKey,
      signOptions: { expiresIn: config.jwt.expiresIn },
    }),
  ],
  controllers: [RegistrationController, RolePermissionCrudController],
  providers: [RegistrationService, JwtStrategyService,EmailService, CommunicationService],
})
export class RegistrationModule {}
