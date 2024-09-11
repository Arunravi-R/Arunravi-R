import { Injectable } from '@nestjs/common';
import { excelDataDto } from './dto/create-upload.dto';
import { Users } from 'src/registration/entities/registration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Courses, Gender, userCoursesMapping } from './entities/upload.entity';
import { log } from 'console';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
    @InjectRepository(Courses)
    private coursesRepository: Repository<Courses>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(userCoursesMapping)
    private usersCoursesMappingRepository: Repository<userCoursesMapping>,
  ) { }

  async getGenderList() {
    return await this.genderRepository.find({
      select: ['id', 'name']
    });
  }

  async getCoursesList() {
     return await this.coursesRepository.find({
        select: ['id', 'name']
      });
  }

  async adduserList(data: any){
    return await this.usersRepository.save(data);
  }

  async adduserCoursesList(data: any){
    return await this.usersCoursesMappingRepository.insert(data);
  }

}
