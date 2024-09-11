import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(70)
  @IsEmail()
  @Transform(({value}) => value.trim())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({value}) => value.trim())
  @MaxLength(70)
  password: string;
}

export class SignUpDto {

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(70)
  @Transform(({value}) => value.trim())
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({value}) => value.trim())
  @MaxLength(100)
  firstName: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @MaxLength(100)
  @Transform(({value}) => value ? value.trim() : null)
  lastName: string;

  @ApiProperty()
  @MaxLength(20)
  @Transform(({value}) => value ? value.trim() : null)
  @IsOptional()
  @IsNumberString({})
  mobile: string;

  @IsStrongPassword({minLength:8,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1})
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({value}) => value.trim())
  @MaxLength(70)
  password: string;

  @IsString({})
  @IsOptional()
  token: string;
}

export class ForgetRequestDto{
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail({})
  @Transform(({value}) => value.trim())
  @MaxLength(70)
  email: string;
}

export class ResetPasswordDto{
  @IsStrongPassword({minLength:8,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1})
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({value}) => value.trim())
  @MaxLength(70)
  password: string;
}
export class verifyOtpNumber {
  @ApiProperty()
  @IsNotEmpty()
  mobileOtp: number

  @ApiProperty()
  @IsNotEmpty()
  mobileNumber: number
  
}
export class resendOtp {
  @ApiProperty()
  @IsOptional()
  mobileNumber: number
}

export class googlelogin {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}

export class ControllersDto {
  @ApiProperty()
  @IsString()
  @Transform(({value}) => value.trim())
  @MaxLength(50)
  @IsNotEmpty()
  name: string;
}

export class PermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  actionId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  controllerId: number;
}

export class RolePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roleId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  permissionId: number;
}

export class RoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ActionsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UserRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleId: number;
}
export class loginwithNumber {
  @ApiProperty()
  @IsOptional()
  mobileNumber: number
}
export class timeoutOtp {
  @ApiProperty()
  @IsOptional()
  otp: boolean
}