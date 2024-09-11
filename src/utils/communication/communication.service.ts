import { Injectable } from '@nestjs/common';

@Injectable()
export class CommunicationService {

    generateOTP() {
        return Math.floor(Math.random() * 9000) + 1000
      }
}
