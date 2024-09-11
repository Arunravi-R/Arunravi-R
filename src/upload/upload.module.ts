import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPermissionModule } from 'src/auth-permission/auth-permission.module';
import { Courses, Gender, userCoursesMapping } from './entities/upload.entity';
import { Users } from 'src/registration/entities/registration.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      Gender,
      Courses,
      Users,
      userCoursesMapping
    ]),
    // AuthPermissionModule
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
