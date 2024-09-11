import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { RegistrationModule } from './registration/registration.module';
import { AuthPermissionModule } from './auth-permission/auth-permission.module';
import { ApprovalModule } from './approval/approval.module';

import { EmailService } from './core/utils/email/email.service';
import { S3FunctionsService } from './core/utils/s3-functions/s3-functions.service';
import { UploadModule } from './upload/upload.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      // synchronize: false,
      synchronize: true,
      autoLoadEntities: true,
    }),

    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        nestWinstonModuleUtilities.format.nestLike('NEST', {
          colors: true,
          prettyPrint: true,
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          level: 'error',
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/activity-%DATE%.log',
          level: 'info',
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/debug-%DATE%.log',
          level: 'debug',
        }),
      ],
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: 587,
        // secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
      template: {
        dir: join(__dirname,'core','utils' ,'email','templates'),
        adapter: new HandlebarsAdapter(),
        // options: {
        //   strict: true,
        // },
      },
    }),

    RegistrationModule,
    AuthPermissionModule,
    ApprovalModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3FunctionsService, EmailService],
})
export class AppModule {}
