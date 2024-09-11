import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as awsConfig } from 'aws-sdk';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const express = require('express');
  app.enableCors({
    origin: ['http://localhost:4200','http://localhost:8100'],
    credentials: true,
  });
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Nest Boiler Plate')
    .setDescription('The Nest Boiler Plate API description')
    .setVersion('1.0')
    .addTag('Boiler Plate')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  awsConfig.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      secret: process.env.SECRETSESSIONKEY,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
