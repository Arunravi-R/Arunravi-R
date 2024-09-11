export interface IGetLogin {
  id: number;
  email: string;
  password: string;
  roleId: string;
  userPermissions: JSON;
}

export interface IMailUser {
  name: string;
  email: string;
  url: string;
  template: string;
  subject: string;
}

export interface IVerifiedUser {
  email: string;
  iat: number;
}

export interface IVerifiedForgetUser {
  email: string;
  id: number;
  iat: number;
  exp: number;
}
