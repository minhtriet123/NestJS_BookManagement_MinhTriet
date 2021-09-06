import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VerificationDataDto } from './dto/verificationData.dto';
import { SmsService } from './sms.service';

@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
export class SmsController {
  constructor(private smsService: SmsService) {}

  @Post('sms-verification')
  @UseGuards(AuthGuard('jwt'))
  async initiatePhoneNumberVerification(@Req() request) {
    if (request.user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number already confirmed');
    }
    await this.smsService.initiatePhoneNumberVerification(
      request.user.phoneNumber,
    );
    return { message: 'Sent verification code' };
  }
  @Post('check-verification-code')
  @UseGuards(AuthGuard('jwt'))
  async checkVerificationCode(
    @Req() request,
    @Body() verificationData: VerificationDataDto,
  ) {
    if (request.user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number already confirmed');
    }
    await this.smsService.confirmPhoneNumber(
      request.user.id,
      request.user.phoneNumber,
      verificationData.code,
    );
    return { message: 'Confirm successfully' };
  }
}
