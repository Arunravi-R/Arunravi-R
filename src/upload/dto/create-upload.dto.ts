import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class excelDataDto {

    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({value}) => value.trim())
    Name: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(70)
    @IsEmail()
    @Transform(({value}) => value.trim())
    Email: string;

    @ApiProperty()
    @IsNotEmpty()
    Phone: number
  
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({value}) => value.trim())
    Gender: string | number;

    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({value}) => value.trim())
    Courses: string;
  }