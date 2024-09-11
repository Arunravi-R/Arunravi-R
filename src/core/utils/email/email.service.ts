import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IMailUser } from 'src/registration/interfaces/registration.interfaces';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  async sendUserConfirmation(user: IMailUser) {
    await this.mailService.sendMail({
      to: user.email,
      from: 'admin@finstein.ai',
      subject: user.subject,
      template: user.template,
      context: {
        name: user.name,
        url: user.url,
      },
    });
  }
}
