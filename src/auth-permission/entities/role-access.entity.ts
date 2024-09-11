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

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: number;

  @Column({ nullable: true })
  createdBy: number;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity('controller_permission')
export class ControllerPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ControllerActions, (ca) => ca.id)
  @JoinColumn({ name: 'actionId' })
  actionId: number ;

  @ManyToOne(() => Controllers, (c) => c.id)
  @JoinColumn({ name: 'controllerId' })
  controllerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  createdBy: string;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity('controllers')
export class Controllers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  createdBy: string;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity('controller_actions')
export class ControllerActions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  createdBy: string;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity('role_permission_mapping')
export class RolePermissionMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Roles, (r) => r.id)
  @JoinColumn({ name: 'roleId' })
  roleId: number;

  @ManyToOne(() => ControllerPermission, (p) => p.id)
  @JoinColumn({ name: 'permissionId' })
  permissionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  createdBy: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
