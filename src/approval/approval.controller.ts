import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('approval')
@ApiTags('approval')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Post('getUserId')
  async getUserId(
    @Res() res: Response,
    @Body() data: string,
  ) {
    try {
      let id = await this.approvalService.getUserId(data);
      res.status(HttpStatus.OK).json({
        message: 'instert successfully',
        id: id,
      });
    } catch (err) {
      console.error(`Error in ${err}`);
    }
  }

  @Post('sumbitfile')
  async sumbitData(
    @Res() res: Response,
    @Body() data: string,
  ) {
    try {
      await this.approvalService.sumbitData(data);

      res.status(HttpStatus.OK).json({
        message: 'instert successfully',
      });
    } catch (err) {
      console.error(`Error in ${err}`);
    }
  }

  @Get('getDocumentDetails')
  async getDocumentDetails(@Req() req: Request, @Res() res: Response) {
    try {
      const roleId = 2;
      let userAndroleDetails = await this.approvalService.getDocumentDetails(
        roleId,
      );
      res.status(HttpStatus.OK).json({
        files: userAndroleDetails,
      });
    } catch (err) {
      console.error(`Error in ${err}`);
    }
  }

  @Post('updateApprovalStatus/:docId')
  async checkAprrovalAccess(
    @Req() req: Request,
    @Res() res: Response,
    @Param('docId') docId: number,
    @Body() data,
  ) {
    try {
      const roleId = 2;
      let accessdetails = await this.approvalService.updateApprovalStatus(
        docId,
        roleId,
        data.statusId,
      );
      const { statusId } =  await this.approvalService.getApprovalDocStatus(docId);
      await this.approvalService.updateDocStatus(docId,statusId)

      res.status(HttpStatus.OK).json({
        message: 'this login as approval state',
        access: accessdetails,
      });
    } catch (err) {
      console.error(`Error in ${err}`);
    }
  }
}
