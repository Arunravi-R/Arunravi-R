import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserList,
  ApprovalRole,
  DocumentApproval,
  UserApproval,
  ApprovalMatrix,
  UserRoleMapping,
} from './entities/approval.entity';
import { IDocStatus } from './interfaces/approval.interfaces';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectRepository(UserList)
    private userRepository: Repository<UserList>,
    @InjectRepository(DocumentApproval)
    private documentRepository: Repository<DocumentApproval>,
    @InjectRepository(UserApproval)
    private approvalRepository: Repository<UserApproval>,
    @InjectRepository(ApprovalMatrix)
    private approvalMatrixRepository: Repository<ApprovalMatrix>,
    @InjectRepository(UserRoleMapping)
    private userRoleMappingRepository: Repository<UserRoleMapping>,
  ) {
    this.getApprovalDocStatus(12);
  }

  async getUserId(data: any) {
    let userId = await this.userRepository.findOne({
      select: ['id'],
      where: {
        name: data.data,
      },
    });

    let roleId = await this.userRoleMappingRepository
      .createQueryBuilder('urm')
      .select(`urm.roleId`)
      .where('urm.userId=:userId', { userId: userId.id })
      .getRawMany();

    data = {
      userId: userId.id,
      roleId: roleId,
    };
    return data;
  }

  async sumbitData(data: any) {
    let documentInfo: any = {
      name: data.data.documentname,
      userId: data.data.id,
      status: 1,
    };

    console.log('documentInfo', documentInfo);

    let id = await this.documentRepository.insert(documentInfo);

    console.log('id------------>', id, id.identifiers[0].id);

    let roles = await this.approvalMatrixRepository
      .createQueryBuilder('amr')
      .select(`amr.userRoleId,amr.approvalOrder`)
      .where('amr.approvalModuleId= :approvalModuleId', { approvalModuleId: 1 })
      .getRawMany();
    console.log('role---------->', roles);

    let aprovaldata: any = roles.map((e) => ({
      approvalModuleId: 1,
      documentID: id.identifiers[0].id,
      userRoleId: e.userRoleId,
      approvalOrder: e.approvalOrder,
      status: null,
      isActive: true,
    }));

    await this.approvalRepository.insert(aprovaldata);

    return;
  }

  async getDocumentDetails(roleId: number) {
    roleId = 3;
    return await this.documentRepository
      .createQueryBuilder('doc')
      .leftJoin(UserApproval, 'ua', 'ua.documentID = doc.id')
      .leftJoin(
        ApprovalMatrix,
        'am',
        'am.approvalModuleId = ua.approvalModuleId',
      )
      .select(
        'doc.name,doc.id,min(ua.approvalOrder) as hasAccess,ua.statusId as status',
      )
      .where('ua.userRoleId = :roleId and am.userRoleId = ua.userRoleId', {
        roleId,
      })
      .groupBy('ua.approvalModuleId,ua.documentID,ua.statusId')
      .execute();
  }

  async updateApprovalStatus(docId: number, roleId: number, statusId: number) {
    return await this.approvalRepository
      .createQueryBuilder()
      .update()
      .set({ statusId: statusId })
      .where('documentID = :docId and userRoleId = :roleId', {
        docId: docId,
        roleId: roleId,
      })
      .execute();
  }

  async getApprovalDocStatus(docId: number): Promise<IDocStatus> {
    const [doc = { statusId: null }] = await this.approvalRepository.query(
      `SELECT statusId 
   FROM user_approval WHERE approvalOrder = 
   (SELECT MAX(approvalOrder) FROM user_approval WHERE documentID = ? ) `,
      [docId],
    );

    return doc;
  }

  async updateDocStatus(docId: number, statusId: number | null): Promise<void> {
    await this.documentRepository
      .createQueryBuilder()
      .update()
      .set({ statusId: statusId })
      .where('documentId = :docId', { docId })
      .execute();
  }
}
