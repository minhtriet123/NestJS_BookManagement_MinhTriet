import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCredentialDto } from './dto/user-credential.dto';
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
}
