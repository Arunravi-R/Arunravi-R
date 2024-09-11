import { Courses, Gender } from 'src/upload/entities/upload.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  userName: string;

  @Column({unique:true})
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  uuidToken: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  userLoginType: string;  

  @Column({ nullable: true })
  googleSub: string;

  @Column({nullable: true })
  roleId: number;

  @Column({default: true})
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  emailAttemptCount: number;

  @Column({ nullable: true })
  emailAttemptDate: Date;

  @ManyToOne(() => Gender, (e) => e.id)
  @JoinColumn({ name: "genderId" })
  genderId: Gender;

  @ManyToOne(() => Courses, (e) => e.id, {})
  @JoinColumn({ name: "coursesId" })
  coursesId: Courses;
}

@Entity('user_otp_mapping')
export class UserOtpMapping {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (e) => e.id)
    @JoinColumn({ name: 'userId' })
    userId: Users;

    @Column()
    otp: number;

    @Column({ default: false })
    timer: boolean;

    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToOne(() => Users, (e) => e.id)
    @JoinColumn({ name: 'createdBy' })
    createdBy: Users;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ManyToOne(() => Users, (e) => e.id)
    @JoinColumn({ name: 'updatedBy' })
    updatedBy: Users;
  
    @DeleteDateColumn()
    deletedAt: Date;
  
    @ManyToOne(() => Users, (e) => e.id)
    @JoinColumn({ name: 'deletedBy' })
    deletedBy: Users;
}