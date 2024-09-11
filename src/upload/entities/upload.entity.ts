import { Users } from 'src/registration/entities/registration.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  @Entity()
  export class Gender {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({nullable:true})
    name: string;
  
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

  @Entity()
  export class Courses {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({nullable:true})
    name: string;
  
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

  @Entity()
  export class userCoursesMapping {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Users, (e) => e.id)
    @JoinColumn({ name: 'userId' })
    userId: Users;

    @ManyToOne(() => Courses, (e) => e.id)
    @JoinColumn({ name: 'courseId' })
    courseId: Courses;
  
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



