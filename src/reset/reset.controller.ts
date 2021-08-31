import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Body,
  Controller,
  forwardRef,
  Inject,
  NotAcceptableException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginStatus } from 'src/auth/loginStatus.enum';
import { UsersService } from 'src/users/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetService } from './reset.service';

@Controller()
export class ResetController {
  constructor(
    private resetService: ResetService,
    private mailerService: MailerService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}
  @Post('forgot')
  async forgot(@Body('email') email: string) {
    const token = Math.random().toString(20).substring(2, 20);
    await this.resetService.create({
      email,
      token,
      isAvailable: true,
    });
    const url = `http:/localhost:3000/reset/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      html: `Click this link below to reset your password: <br/> http:/localhost:3000/reset/${token}`,
    });
    return { message: ' Please check your email...!', token: token };
  }

  @Post('reset')
  async reset(
    @Body('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const { password, passwordConfirm } = resetPasswordDto;
    if (password !== passwordConfirm)
      throw new BadRequestException(LoginStatus.NOT_MATCHED);
    const reset = await this.resetService.findOne({ token });

    const isAvailable = reset.isAvailable;

    if (isAvailable) {
      const email = reset.email;

      const user = await this.usersService.findOneBy({ email });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await this.usersService.update(user.id, { password: hashedPassword });

      await this.resetService.setUnavailableToken({ token });

      return { message: 'Success!' };
    }
    throw new NotAcceptableException('Token is unavailable!');
  }
}
