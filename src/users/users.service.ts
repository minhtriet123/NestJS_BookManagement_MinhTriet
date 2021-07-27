import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { loggerApp } from 'src/logger.enum/logger.enum';
import { AccessTokenDto } from './dto/accessToken.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/get-profile.dto';
import { UserCredentialDto } from './dto/user-credential.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { LoginStatus } from '../auth/loginStatus.enum';
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

  async getProfile(user: User): Promise<ProfileDto> {
    return this.userRepositry.getProfile(user);
  }

  async editProfile(user: User, profileDto: ProfileDto): Promise<ProfileDto> {
    return this.userRepositry.editProfile(user, profileDto);
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new ConflictException('No User Google Found');
    }
    const userGG = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      avatar: req.user.picture,
    };
    const email = userGG.email;
    // create default password if login by google for first test
    const password = 'passWordAutoMadetoLoginBygoogle@@112211';
    const user = await this.userRepositry.findOne({ email });

    // Hash Password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    // if exist email account == email google => access to this account.
    // if no email == email google => create new account = infor email google then login to this account.
    if (user) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      this.logger.verbose(loggerApp.USER_LOGGING + JSON.stringify(email));
      return this.responseHTML(accessToken);
    } else {
      const newUser = this.userRepositry.create({
        ...userGG,
        password: hash,
      });
      // Create new account
      try {
        await this.userRepositry.save(newUser);
      } catch (error) {
        this.logger.error(loggerApp.FAIL_CREATE_ACC_BY_GG);
        throw new InternalServerErrorException(loggerApp.FAIL_CREATE_ACC_BY_GG);
      }
      // Login to this account
      try {
        const payload: JwtPayload = { email };
        const accessToken: string = await this.jwtService.sign(payload);
        this.logger.verbose(loggerApp.USER_LOGGING + JSON.stringify(email));

        return this.responseHTML(accessToken);
      } catch (error) {
        this.logger.error(loggerApp.FAIL_LOGIN_GG);
        throw new InternalServerErrorException(loggerApp.FAIL_LOGIN_GG);
      }
    }
  }

  async facebookLogin(req) {
    if (!req.user) {
      throw new ConflictException('No User Facebook Found');
    }
    const userFB = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    };
    const email = userFB.email;
    // create default password if login by google for first test
    const password = 'passWordAutoMadetoLoginByfacebook@@112211';
    const user = await this.userRepositry.findOne({ email });

    // Hash Password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    // if exist email account == email google => access to this account.
    // if no email == email google => create new account = infor email google then login to this account.
    if (user) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      this.logger.verbose(loggerApp.USER_LOGGING + JSON.stringify(email));
      return this.responseHTML(accessToken);
    } else {
      const newUser = this.userRepositry.create({
        ...userFB,
        password: hash,
      });
      // Create new account
      try {
        await this.userRepositry.save(newUser);
      } catch (error) {
        this.logger.error(loggerApp.FAIL_CREATE_ACC_BY_GG);
        throw new InternalServerErrorException(loggerApp.FAIL_CREATE_ACC_BY_GG);
      }
      // Login to this account
      try {
        const payload: JwtPayload = { email };
        const accessToken: string = await this.jwtService.sign(payload);
        this.logger.verbose(loggerApp.USER_LOGGING + JSON.stringify(email));

        return this.responseHTML(accessToken);
      } catch (error) {
        this.logger.error(loggerApp.FAIL_LOGIN_GG);
        throw new InternalServerErrorException(loggerApp.FAIL_LOGIN_GG);
      }
    }
  }

  responseHTML = (data) => {
    let responseHTML =
      '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
    responseHTML = responseHTML.replace(
      '%value%',
      JSON.stringify({
        accessToken: data,
      }),
    );
    return responseHTML;
  };
}
