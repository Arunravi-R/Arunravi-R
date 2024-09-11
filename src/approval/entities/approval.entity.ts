import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  @Entity()
export class UserList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserList;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserList;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserList;
}
@Entity()
export class ApprovalRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserList;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserList;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserList;

}

@Entity()
export class ApprovalModules {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  documentName: string;

  @Column({nullable:true})
  tableName: string;

  @Column({nullable:true})
  mappingId: string;

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserList;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserList;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserList;
}

@Entity()
export class ApprovalMatrix {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ApprovalModules, (e) => e.id)
  @JoinColumn({ name: 'approvalModuleId' })
  approvalModuleId: ApprovalModules;

  @ManyToOne(() => ApprovalRole, (e) => e.id)
  @JoinColumn({ name: 'userRoleId' })
  userRoleId: ApprovalRole;

  @Column({nullable:true})
  approvalOrder: number;

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserList;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserList;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserList;
}


@Entity()
export class ApprovalStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserList;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserList;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserList;

}

@Entity()
export class DocumentApproval {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'userId' })
  userId: UserList;

  @Column({nullable:true})
  name: string;

  @ManyToOne(() => ApprovalStatus, (e) => e.id)
  @JoinColumn({ name: 'statusId' })
  statusId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserList;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserList;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserList;
}

@Entity()
export class UserApproval {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ApprovalModules, (e) => e.id)
  @JoinColumn({ name: 'approvalModuleId' })
  approvalModuleId: ApprovalModules;

  @ManyToOne(() => DocumentApproval, (e) => e.id)
  @JoinColumn({ name: 'documentID' })
  documentID: DocumentApproval;

  @ManyToOne(() => ApprovalRole, (e) => e.id)
  @JoinColumn({ name: 'userRoleId' })
  userRoleId: ApprovalRole;

  @Column({nullable:true})
  approvalOrder: number;

  @ManyToOne(() => ApprovalStatus, (e) => e.id)
  @JoinColumn({ name: 'statusId' })
  statusId: number;

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserList;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserList;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserList;
}

@Entity()
export class UserRoleMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'userId' })
  userId: UserList;

  @ManyToOne(() => ApprovalRole, (e) => e.id)
  @JoinColumn({ name: 'roleId' })
  roleId: ApprovalRole;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserList;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserList;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserList, (e) => e.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserList;

}

