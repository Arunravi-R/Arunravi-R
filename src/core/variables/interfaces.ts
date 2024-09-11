import { Response } from 'express';
import { PermissionAction } from 'src/auth-permission/permission/casl-ability.factory/casl-ability.factory';

export interface ValUser {
  email: string;
  id: string;
  roleId: string;
  iat: number;
  exp: number;
}

export interface EchoParams {
  res: Response;
  isChanged: boolean;
  endPoint: string;
  successMsg: string;
  errorMsg: string;
}

export interface MasterDropData {
  id: string;
  name: string;
}

export interface S3UploadData {
  key: string;
  url:string;
}

export interface UserPermissions{
  action:PermissionAction,
  name:string
}
