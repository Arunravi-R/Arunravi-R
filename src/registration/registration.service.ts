import { Injectable } from '@nestjs/common';
import {
  ActionsDto,
  ControllersDto,
  PermissionDto,
  RoleDto,
  RolePermissionDto,
  SignUpDto,
} from './dto/create-registration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/registration.entity';
import { UserOtpMapping } from './entities/registration.entity';
import { Repository } from 'typeorm';
import {
  ControllerActions,
  ControllerPermission,
  Controllers,
  RolePermissionMapping,
  Roles,
} from 'src/auth-permission/entities/role-access.entity';
import { IGetLogin } from './interfaces/registration.interfaces';


@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(UserOtpMapping)
    private UserOtpMappingRepositry: Repository<UserOtpMapping>,

    @InjectRepository(Roles)
    private roleRepository: Repository<Roles>,

    @InjectRepository(Controllers)
    private controllerRepository: Repository<Controllers>,

    @InjectRepository(ControllerActions)
    private controllerActionsRespo: Repository<ControllerActions>,

    @InjectRepository(RolePermissionMapping)
    private RolePermissionMappingRepo: Repository<RolePermissionMapping>,

    @InjectRepository(ControllerPermission)
    private ControllerPermissionRepo: Repository<ControllerPermission>,
  ) {}

  async signup(data: SignUpDto): Promise<void> {
    await this.userRepository.save(data);
  }

  async isEmailExists(email: string): Promise<boolean> {
    return await this.userRepository
      .createQueryBuilder('u')
      .where('u.email = :email and isVerified = 1', { email })
      .getExists();
  }

  async login(email: string): Promise<IGetLogin> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select('user.id,user.email,user.password,user.roleId')
      .addSelect((subQuery) => {
        return subQuery
          .select(
            "JSON_ARRAYAGG(JSON_OBJECT('action',ca.name,'subject',c.name))",
            'userPermissions',
          )
          .innerJoin(ControllerPermission, 'cp', 'cp.id = rpm.permissionId')
          .innerJoin(ControllerActions, 'ca', 'ca.id = cp.actionId')
          .innerJoin(Controllers, 'c', 'c.id = cp.controllerId')
          .from(RolePermissionMapping, 'rpm')
          .where('rpm.roleId = user.roleId');
      }, 'userPermissions')
      .where('user.email=:email and user.isVerified = 1', { email })
      .getRawOne<IGetLogin>();
  }

  async getUserInfo(email: string): Promise<Users> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id', 'isVerified','firstName','lastName','email'],
    });
  }

  async updateIsVerified(userId: number):Promise<void> {
    const update = await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ isVerified: true })
      .where('id = :userId', { userId })
      .execute();
  }

  async updatePassword(userId: number, password: string):Promise<void> {
    const update = await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ password: password })
      .where('id = :userId', { userId })
      .execute();
  }

  async saveRoles(data: RoleDto): Promise<void> {
    await this.roleRepository.save(data);
  }

  async saveControllerObjects(data: ControllersDto): Promise<void> {
    await this.controllerRepository.save(data);
  }

  async saveControllerActions(data: ActionsDto): Promise<void> {
    await this.controllerActionsRespo.save(data);
  }

  async saveControllerPermission(data: PermissionDto): Promise<void> {
    await this.ControllerPermissionRepo.save(data);
  }

  async saveUserPermission(data: RolePermissionDto): Promise<void> {
    await this.RolePermissionMappingRepo.save(data);
  }

  async getUserDataByGoogleSub(sub) {
   return await this.userRepository.findOne({
      where: {
        googleSub: sub,
      }
    });
  }

  async addUserData(loginData) {
    return await this.userRepository.save(loginData);
  }

  async getLoginNumber(loginData) {
    return await this.userRepository.findOne({
       where: {
        mobile: loginData.mobileNumber,
       }
     });
   }

   async addLoginNumber(loginData) {
    return await this.userRepository.save(loginData);
  }

  async addOtpDetails(loginData) {
    return await this.UserOtpMappingRepositry.insert(loginData);
  }
   

  async getUserDetails(loginOpt){
    
    return await this.userRepository
    .createQueryBuilder("u")
    .innerJoin(UserOtpMapping, "uom",'uom.userId = u.id')
    .select('uom.otp,uom.timer')
    .where('uom.otp = :otp and u.mobile = :mobileNumber',
       {otp: loginOpt.mobileOtp, mobileNumber: loginOpt.mobileNumber})
    .getRawOne()
    
  }

  async timeoutOtp(loginData: any) {
  
   return await this.UserOtpMappingRepositry.update({ otp: loginData.otp},{
      timer:true
    });
    
  }

 
}
