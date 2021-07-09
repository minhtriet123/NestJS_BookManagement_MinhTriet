import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { loggerApp } from 'src/logger.enum/logger.enum';
import { AccessTokenDto } from './dto/accessToken.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetProfile } from './dto/get-profile.dto';
import { UserCredentialDto } from './dto/user-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { LoginStatus } from './loginStatus.enum';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(UserRepository) private userRepositry: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<UserCredentialDto> {
    return this.userRepositry.createUser(createUserDto);
  }

  async signIn(userCredentialDto: UserCredentialDto): Promise<AccessTokenDto> {
    const { email, password } = userCredentialDto;
    const user = await this.userRepositry.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      this.logger.verbose(
        loggerApp.USER_LOGGING + JSON.stringify(userCredentialDto.email),
      );
      return { accessToken };
    } else {
      this.logger.warn(
        JSON.stringify(userCredentialDto.email) + loggerApp.FAIL_LOGIN,
      );
      throw new UnauthorizedException(LoginStatus.FAIL_LOGIN);
    }
  }
  async getProfile(user: User): Promise<GetProfile> {
    return this.userRepositry.getProfile(user);
  }
}
