import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  Inject,
  Req,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { loginwithNumber } from './dto/create-registration.dto';
import {
  ForgetRequestDto,
  ResetPasswordDto,
  googlelogin,
  verifyOtpNumber,
  resendOtp,
  timeoutOtp,
} from './dto/create-registration.dto';
import { RegistrationService } from './registration.service';
import { Response, Request } from 'express';
import { LoginDto, SignUpDto } from './dto/create-registration.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/core/utils/email/email.service';
import { MailTemplates } from 'src/core/variables/enum';
import {
  IVerifiedForgetUser,
  IVerifiedUser,
} from './interfaces/registration.interfaces';
import { default as config } from '../jwt.config';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CommunicationService } from 'src/utils/communication/communication.service';
const https = require('https');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.gapi.CLIENT_ID);

@Controller('registration')
@UseGuards(ThrottlerGuard)
@ApiBearerAuth()
export class RegistrationController {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly emailService: EmailService,
    private CommunicationService: CommunicationService,
  ) {}

  @Throttle(5, 120)
  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: LoginDto,
  ) {
    try {
      const loginData = await this.registrationService.login(data.email);

      if (!loginData) {
        this.logger.error(
          `${RegistrationController.name} | login |  Email Not Found | Email:${data.email}`,
        );
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Email or Password is invalid',
        });
      }

      if (!(await bcrypt.compare(data.password, loginData.password))) {
        this.logger.error(
          `${RegistrationController.name} | login |  Invalid Password | Email:${data.email}`,
        );
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Email or Password is invalid',
        });
      }

      const payload = {
        email: loginData.email,
        id: loginData.id,
        roleId: loginData.roleId,
      };
      const accessToken = this.jwtService.sign(payload);

      this.logger.info(
        `| ${RegistrationController.name} | login | ${loginData.id} Login successfully`,
      );
      res.status(HttpStatus.OK).json({
        message: 'Login successfully',
        data: {
          token: accessToken,
          userPermissions: loginData.userPermissions,
          sessionId: req.session.id,
        },
      });
    } catch (error) {
      this.logger.error(
        ` | ${RegistrationController.name} | login |  Somthing went to login | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'Something went wrong',
      });
    }
  }

  @SkipThrottle()
  @Post('signup')
  async signUp(@Res() res: Response, @Body() data: SignUpDto) {
    try {
      if (await this.registrationService.isEmailExists(data.email)) {
        this.logger.error(
          ` | ${RegistrationController.name} | signup |  Email is already register| email - ${data.email}`,
        );
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Email is already registered',
        });
      }

      data['password'] = await bcrypt.hash(data['password'], 10);
      const payload = {
        email: data.email,
      };
      const token = this.jwtService.sign(payload, {
        expiresIn: config.jwt.expiresIn,
      });
      const fullName = data.firstName + ' ' + data.lastName ?? '';

      await this.emailService.sendUserConfirmation({
        name: fullName,
        email: data.email,
        url: `${process.env.LOCAL_BASE_URL}/verifyingEmail/${token}`,
        subject: 'Welcome to Nest BoilerPlate !!!',
        template: MailTemplates.SELF_MAIL,
      });

      await this.registrationService.signup(data);

      this.logger.info(
        ` | ${RegistrationController.name} | signup | Account created successfully`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Account Created',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        ` | ${RegistrationController.name} | signup | Unable to signup | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'Unable to signup',
      });
    }
  }

  @Post('googlelogin')
  async googlelogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() loginData: googlelogin,
  ) {
    console.log('logindata', loginData);
    try {
      console.log('aaaaaaaaaa');

      const ticket = await client.verifyIdToken({
        idToken: loginData.token,
        audience: config.gapi.CLIENT_ID,
      });
      console.log('ticket', ticket);
      const googlePayload = await ticket.getPayload();
      console.log('payload', googlePayload);

      let getUserData = await this.registrationService.getUserDataByGoogleSub(
        googlePayload['sub'],
      );
      if (getUserData == undefined) {
        let createduser = await this.registrationService.addUserData({
          email: googlePayload['email'],
          googleSub: googlePayload['sub'],
          userLoginType: 'google',
          isVerified: true,
        });

        let payload = {
          id: createduser.id,
          email: createduser.email,
        };
        let accessToken = this.jwtService.sign(payload);

        res.status(HttpStatus.OK).json({
          success: true,
          message: 'Login successful',
          token: accessToken,
          userId: createduser.id,
          name: createduser.name,
        });
      }
    } catch (error) {
      console.log(error);
      this.logger.error('Invalid Login');
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Invalid Login. Try again',
      });
    }
  }

  @Throttle(3, 24 * 60 * 60)
  @Post('verify/:token')
  async verifyToken(@Res() res: Response, @Param('token') token: string) {
    try {
      if (!token || typeof token != 'string') {
        this.logger.error(
          ` | ${RegistrationController.name} | verify | Token is invalid|`,
        );
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Token is invalid',
        });
      }

      const userInfo = this.jwtService.verify<IVerifiedUser>(token);
      const userDetails = await this.registrationService.getUserInfo(
        userInfo.email,
      );

      if (userDetails && userDetails.isVerified) {
        this.logger.error(
          ` | ${RegistrationController.name} | verify | Account already verified`,
        );
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Your account already verified',
        });
      }

      await this.registrationService.updateIsVerified(userDetails.id);

      this.logger.info(
        ` | ${RegistrationController.name} | verify | Account verified successfully`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Your account verified successfully',
      });
    } catch (error) {
      this.logger.error(
        ` | ${RegistrationController.name} | verify | Unable to verify | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'Unable to verify your account',
      });
    }
  }

  @Throttle(3, 24 * 60 * 60)
  @Post('forgetRequest')
  async forget(@Res() res: Response, @Body() data: ForgetRequestDto) {
    try {
      const userDetails = await this.registrationService.getUserInfo(
        data.email,
      );

      if (!userDetails || !userDetails?.isVerified) {
        this.logger.error(
          ` | ${RegistrationController.name} | forgetRequest | Email is not found `,
        );
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Unable to forget a password',
        });
      }

      const payload = {
        email: userDetails.email,
        id: userDetails.id,
      };
      const token = this.jwtService.sign(payload, {
        expiresIn: config.jwt.forgetTokenExpiresIn,
      });
      const fullName = userDetails.firstName + ' ' + userDetails.lastName ?? '';

      await this.emailService.sendUserConfirmation({
        name: fullName,
        email: userDetails.email,
        url: `${process.env.LOCAL_BASE_URL}/verifyForgetPassword/${token}`,
        subject: 'Welcome to Nest BoilerPlate !!!',
        template: MailTemplates.FORGET_MAIL,
      });

      this.logger.info(
        ` | ${RegistrationController.name} | forgetRequest | Mail sent successfully`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Mail sent successfully',
      });
    } catch (error) {
      this.logger.error(
        ` | ${RegistrationController.name} | forgetRequest | Unable to verify | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'Unable to forget',
      });
    }
  }

  @Throttle(3, 24 * 60 * 60)
  @Get('verifyForgetPassword/:token')
  async verifyForgetPassword(
    @Res() res: Response,
    @Param('token') token: string,
  ) {
    try {
      if (!token || typeof token != 'string') {
        this.logger.error(
          ` | ${RegistrationController.name} | verifyForgetPassword | Token is invalid|`,
        );
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Token is invalid',
        });
      }

      const info = this.jwtService.verify<IVerifiedForgetUser>(token);
      console.log(info);

      this.logger.info(
        ` | ${RegistrationController.name} | verifyForgetPassword | forget Passsword request verified successfully`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Your forget Passsword request verified successfully',
      });
    } catch (error) {
      this.logger.error(
        ` | ${RegistrationController.name} | verifyForgetPassword | Unable to verify | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'Your token is expired or invalid',
      });
    }
  }

  @Throttle(3, 24 * 60 * 60)
  @Post('resetPassword/:token')
  async resetPassword(
    @Res() res: Response,
    @Param('token') token: string,
    @Body() data: ResetPasswordDto,
  ) {
    try {
      if (!token || typeof token != 'string') {
        this.logger.error(
          ` | ${RegistrationController.name} | resetPassword | Token is invalid|`,
        );
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Token is invalid',
        });
      }
      const info = this.jwtService.verify<IVerifiedForgetUser>(token);
      data['password'] = await bcrypt.hash(data.password, 10);
      await this.registrationService.updatePassword(info.id, data.password);

      this.logger.info(
        ` | ${RegistrationController.name} | resetPassword | Password reseted successfully`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Your passsword updated successfully',
      });
    } catch (error) {
      this.logger.error(
        ` | ${RegistrationController.name} | resetPassword | Unable to update password | ${error}`,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'Unable to update your password',
      });
    }
  }

  @Post('loginwithNumber')
  async loginwithNumber(
    @Req() req: Request,
    @Res() res: Response,
    @Body() loginData: loginwithNumber,
  ) {
    console.log('logindata', loginData);

    try {
      let getLoginNumber = await this.registrationService.getLoginNumber(
        loginData,
      );
      let otp = this.CommunicationService.generateOTP();

      if (getLoginNumber == undefined || getLoginNumber == null) {

        let user = await this.registrationService.addLoginNumber({
          mobile: loginData.mobileNumber,
          userLoginType: 'mobile',
          isVerified: true,
        });
        await this.registrationService.addOtpDetails({
          userId: user.id,
          otp: otp,
        });
        res.status(HttpStatus.OK).json({
          success: true,
          number: loginData.mobileNumber,
          otp: otp,
          timer: true,
        });
      } else {
        await this.registrationService.addOtpDetails({
          userId: getLoginNumber.id,
          otp: otp,
        });
        res.status(HttpStatus.OK).json({
          success: true,
          number: loginData.mobileNumber,

          otp: otp,
          timer: true,
        });
      }
    } catch (error) {
      console.log(error);
      this.logger.error('Invalid Login');
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Invalid Login. Try again',
      });
    }
  }

  @Post('verifyOtpNumber')
  async verifyOtpNumber(
    @Req() req: Request,
    @Res() res: Response,
    @Body() loginOpt: verifyOtpNumber,
  ) {
    console.log('verifyOtpNumber', loginOpt);

    try {
      // let verified = await this.registrationService.verifyOtpNumber(loginOpt);
      //  console.log('res.status',verified);

      let userDetails = await this.registrationService.getUserDetails(loginOpt);
      console.log('DDDDDDDDDd', userDetails);
      if (userDetails != undefined && userDetails != null) {
        let payload = {
          id: userDetails.id,
        };
        let accessToken = this.jwtService.sign(payload);

        if (
          userDetails?.otp == loginOpt.mobileOtp &&
          userDetails?.timer == false
        ) {
          await this.registrationService.timeoutOtp(loginOpt)
          res.status(HttpStatus.OK).json({
            opt: userDetails.otp,
            token: accessToken,
            name: userDetails.userName,
            success: true,
            message: 'OTP Verified Successful',
          });
          console.log('MatchingOtp', userDetails?.otp == loginOpt.mobileOtp);
        } else {

          res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: 'Invalid Otp',
          });
        }
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Invalid Otp',
        });
      }
    } catch (error) {
      console.log(error);
      this.logger.error('Invalid Otp');
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in VerifyOtpNumber',
      });
    }
  }
  @Post('resendOtp')
  async resendOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() loginOpt: resendOtp,
  ) {
    try {
      // let verfied = await this.registrationService.resendOtp(loginOpt);

      let getLoginNumber = await this.registrationService.getLoginNumber(
        loginOpt,
      );

      console.log('getLoginNumber', getLoginNumber);

      let payload = {
        id: getLoginNumber.id,
        mobile: getLoginNumber.mobile,
      };
      let accessToken = this.jwtService.sign(payload);
      let otp = this.CommunicationService.generateOTP();
      if (getLoginNumber == undefined || getLoginNumber == null) {
        let user = await this.registrationService.addLoginNumber({
          mobile: loginOpt.mobileNumber,
          userLoginType: 'mobile',
          isVerified: true,
        });
        await this.registrationService.addOtpDetails({
          userId: getLoginNumber.id,
          otp: otp,
        });
        res.status(HttpStatus.OK).json({
          number: loginOpt.mobileNumber,
          otp: otp,
          accessToken: accessToken,
        });
      } else {
        if (getLoginNumber.mobile || loginOpt.mobileNumber) {
          await this.registrationService.getLoginNumber(loginOpt);
          await this.registrationService.addOtpDetails({
            userId: getLoginNumber.id,
            otp: otp,
          });
        }
        res.status(HttpStatus.OK).json({
          number: loginOpt.mobileNumber,
          otp: otp,
          accessToken: accessToken,
        });
      }
    } catch (error) {
      console.log(error);
      this.logger.error('Invalid Otp');
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Invalid Otp',
      });
    }
  }
  @Post('timeoutOtp')
  async timeoutOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() loginOpt: timeoutOtp,
  ) {
    console.log('timeoutotp', loginOpt);

    try {
      let verfied = await this.registrationService.timeoutOtp(loginOpt);

      res.status(HttpStatus.OK).json({
        message: 'Otp Time Out',
      });
    } catch (error) {
      console.log(error);
      this.logger.error('Invalid Otp');
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Invalid Otp',
      });
    }
  }

  @SkipThrottle()
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        this.logger.error(
          ` | ${RegistrationController.name} | logout | Unable to logout | ${err}`,
        );
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Unable to logout',
        });
      }

      this.logger.info(
        ` | ${RegistrationController.name} | logout | logout successfully`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Logout successfully',
      });
    });
  }
}
