import { Controller, Get, Inject, Post, Body, Req, Res, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { UploadService } from './upload.service';
import { excelDataDto } from './dto/create-upload.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Response, Request } from 'express';
import { log } from 'console';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }


  @Post('sumbitUpload')
  async sumbitUpload(@Req() req: Request, @Res() res: Response, @Body() data: excelDataDto[]) {
    try {
      console.log('data------------>', data);
// master table
      let courseList = await this.uploadService.getCoursesList();
      let genderList = await this.uploadService.getGenderList();

      data.forEach(async (e: any) => {
        // let gender = genderList.filter(d => e.Gender.split(',').map(e => e.trim()).includes(d.name));
        let gender = genderList.find(({ name }) => name == e.Gender)
        e.genderId = gender?.id
        e.userName= e.Name
        e.email= e.Email
        e.mobile= e.Phone

        // let courses = courseList.filter(d => e.Courses.split(',').map(e => e.trim()).includes(d.name));
        let courseId = []
        if (e.Courses) {
          e.Courses.split(',').map(c => {
            let foundedCourse = courseList.find(({ name }) => name == c.trim())
            if (foundedCourse) {
              courseId.push(foundedCourse.id)
            }
          })
        }
        e.courseId = courseId
      });
// insert users table 
      let userListId = await this.uploadService.adduserList(data);
      let object = data.map((e, i)=>{
        e['id'] = userListId[i].id
        return e
      })  

// multip courses choose an same user
      let usersCourse = object.flatMap((user: any) => {
        return user.courseId.map(courseId => {
          return {
            courseId: courseId,
            userId: user.id,
          };
        });
      });

// insert coursesid in mapping table
     this.uploadService.adduserCoursesList(usersCourse);

      res.status(HttpStatus.OK).json({
        message: "instert data successfully",
      });
    } catch (error) {
      console.log(error);
      this.logger.error("Invalid data");
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: "Invalid data",
      });
    }
  }



}
