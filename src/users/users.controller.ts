import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenDto } from './dto/accessToken.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/get-profile.dto';
import { UserCredentialDto } from './dto/user-credential.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('api/users')
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private userService: UsersService) {}
  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
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
  getProfile(@GetUser() user: User): Promise<ProfileDto> {
    console.log(user);
    return this.userService.getProfile(user);
  }

  @Post('/edit')
  @UseGuards(AuthGuard('jwt'))
  editProfile(
    @GetUser() user: User,
    @Body() ProfileDto: ProfileDto,
  ): Promise<ProfileDto> {
    return this.userService.editProfile(user, ProfileDto);
  }

  @Patch('/update-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.userService.updatePassword(updatePasswordDto, user);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.userService.googleLogin(req);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req) {
    return this.userService.facebookLogin(req);
  }

  @Post('avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('img'))
  async addAvatar(@Req() request, @UploadedFile() file: Express.Multer.File) {
    return this.userService.addAvatar(request.user.id, file.buffer, file.originalname);
  }
}
