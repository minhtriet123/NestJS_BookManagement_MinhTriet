import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCredentialDto } from './dto/user-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
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
