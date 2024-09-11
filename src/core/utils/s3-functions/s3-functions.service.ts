import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as sharp from 'sharp';
import { S3UploadData } from 'src/core/variables/interfaces';

@Injectable()
export class S3FunctionsService {
  constructor() {}

  async uploadPublicFile(
    dataBuffer: Buffer,
    fileName: string,
    fileMimeType: string,
  ): Promise<S3UploadData> {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        Key: fileName,
        ContentType: fileMimeType,
      })
      .promise();
    return {
      key: uploadResult.Key,
      url: uploadResult.Location,
    };
  }

  async uploadTemplateData(
    data: object,
    fileName: string,
  ): Promise<S3UploadData> {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: data,
        Key: fileName + '.json',
        ContentType: 'application/json',
      })
      .promise();
    return {
      key: uploadResult.Key,
      url: uploadResult.Location,
    };
  }

  async resizeImage(buffer: Buffer, type: string): Promise<string> {
    let img = await sharp(buffer)
      .resize({
        width: 300,
        height: 150,
      })
      .toBuffer();

    return `data:${type};base64,` + img.toString('base64');
  }

  getAttachmentImage(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let getParams = {
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Key: key,
      };
      const s3 = new S3();
      s3.getObject(getParams, async (err, data: any) => {
        if (err) {
          reject(err);
        } else {
            
          key = key.toLocaleLowerCase();

          if (key.endsWith('.png')) {
            let objectData = Buffer.from(data.Body, 'binary').toString(
              'base64',
            );
            let imageData = 'data:image/png;base64,' + objectData;
            resolve(imageData);
          } else if (key.endsWith('.jpg')) {
            let objectData = Buffer.from(data.Body, 'binary').toString(
              'base64',
            );
            let imageData = 'data:image/jpg;base64,' + objectData;
            resolve(imageData);
          } else if (key.endsWith('.jpeg')) {
            let objectData = Buffer.from(data.Body, 'binary').toString(
              'base64',
            );
            let imageData = 'data:image/jpeg;base64,' + objectData;
            resolve(imageData);
          } else if (key.endsWith('.docx')) {
            let objectData = Buffer.from(data.Body, 'binary').toString(
              'base64',
            );
            let imageData = 'data:application/pdf;base64,' + objectData;
            resolve(imageData);
          } else if (key.endsWith('.xlsx')) {
            let objectData = Buffer.from(data.Body, 'binary').toString(
              'base64',
            );
            let imageData = 'data:application/xlsx;base64,' + objectData;
            resolve(imageData);
          } else if (key.endsWith('.pdf')) {
            let objectData = Buffer.from(data.Body, 'binary').toString(
              'base64',
            );
            let imageData = 'data:application/pdf;base64,' + objectData;
            resolve(imageData);
          } else if (key.endsWith('.tiff')) {
            let objectData = Buffer.from(data.Body, 'binary').toString(
              'base64',
            );
            let imageData = 'data:application/tiff;base64,' + objectData;
            resolve(imageData);
          } else {
            resolve(data.Body.toString('utf-8'));
          }
        }
      });
    });
  }

  generateOTP() {
    return Math.floor(Math.random() * 9000) + 1000;
  }
}

export const imageFileFilter = (req, file, callback) => {
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|pdf|xlsx|docx|document|sheet|tiff)$/,
    )
  ) {
    return callback(
      req.res.status(400).send({
        statusCode: 400,
        message: ['Only .docx files are allowed!'],
        error: 'Bad Request',
      }),
      false,
    );
  }
  callback(null, true);
};

export const docFileFilter = (req, file, callback) => {
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|pdf|xlsx|docx|document|sheet|tiff)$/,
    )
  ) {
    return callback(
      req.res.status(400).send({
        statusCode: 400,
        message: [
          'Only .docx, .png, .pdf ,.jpg ,.jpeg ,.tiff ,.docx ,.xlsx files are allowed!',
        ],
        error: 'Bad Request',
      }),
      false,
    );
  }
  callback(null, true);
};
