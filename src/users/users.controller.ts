import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { loggerApp } from 'src/logger.enum/logger.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCredentialDto } from './dto/user-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
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
  signIn(@Body() usercredentialDto: UserCredentialDto) {
    return this.userService.signIn(usercredentialDto);
  }
  @Get()
  getProfile(@GetUser() user: User) {
    return this.userService.getProfile(user);
  }
}
