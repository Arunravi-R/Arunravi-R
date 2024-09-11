import { Module } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { ApprovalController } from './approval.controller';
import { AuthPermissionModule } from 'src/auth-permission/auth-permission.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalRole, UserList, ApprovalModules, ApprovalMatrix, UserApproval, DocumentApproval, UserRoleMapping, ApprovalStatus } from './entities/approval.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      ApprovalRole,
      UserList,
      ApprovalModules,
      ApprovalMatrix,
      UserApproval,
      DocumentApproval,
      UserRoleMapping,
      ApprovalStatus
    ]),
    AuthPermissionModule
  ],
  controllers: [ApprovalController],
  providers: [ApprovalService]
})
export class ApprovalModule {}
