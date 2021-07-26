import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { loggerApp } from 'src/logger.enum/logger.enum';
import { AccessTokenDto } from './dto/accessToken.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetProfileDto } from './dto/get-profile.dto';
import { UserCredentialDto } from './dto/user-credential.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private userService: UsersService) {}
  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    this.logger.verbose(
      loggerApp.NEW_USER + JSON.stringify(createUserDto.email),
    );
    return this.userService.signUp(createUserDto);
  }
  @Post('/signin')
  signIn(
    @Body() usercredentialDto: UserCredentialDto,
  ): Promise<AccessTokenDto> {
    return this.userService.signIn(usercredentialDto);
  }
  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: User): Promise<GetProfileDto> {
    console.log(user);
    return this.userService.getProfile(user);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.userService.googleLogin(req);
  }
}
