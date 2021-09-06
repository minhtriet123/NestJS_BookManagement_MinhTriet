import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  initiatePhoneNumberVerification(phoneNumber: string) {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    return this.twilioClient.verify
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
  }
  async confirmPhoneNumber(userId, phoneNumber: string, verificationCode: string) {
    const serviceSid = this.configService.get('TWILIO_VERIFICATION_SERVICE_SID');
 
    const result = await this.twilioClient.verify.services(serviceSid)
      .verificationChecks
      .create({to: phoneNumber, code: verificationCode})
 
    if (!result.valid || result.status !== 'approved') {
      throw new BadRequestException('Wrong code provided');
    }
 
    return await this.usersService.markPhoneNumberAsConfirmed(userId)
    
  }

  async sendMessage(receiverPhoneNumber: string, message: string) {
    const senderPhoneNumber = this.configService.get('TWILIO_SENDER_PHONE_NUMBER');
 
    return this.twilioClient.messages
      .create({ body: message, from: senderPhoneNumber, to: receiverPhoneNumber })
  }
}
