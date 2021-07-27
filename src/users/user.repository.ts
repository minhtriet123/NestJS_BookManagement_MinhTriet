import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { equals } from 'class-validator';
import { LoginStatus } from '../auth/loginStatus.enum';
import { ProfileDto } from './dto/get-profile.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, confirmPassword, firstName, lastName, avatar } =
      createUserDto;

    // Hash Password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    if (equals(password, confirmPassword)) {
      const user = this.create({
        email,
        password: hash,
        firstName,
        lastName,
        avatar,
      });
      try {
        await this.save(user);
        return user;
      } catch (error) {
        if (error.code === LoginStatus.EXISTS_EMAIL_CODE)
          throw new ConflictException(LoginStatus.EXISTS_EMAIL);
        else {
          throw new InternalServerErrorException();
        }
      }
    } else {
      throw new ConflictException(LoginStatus.NOT_MATCHED);
    }
  }
  async getProfile(user: User): Promise<ProfileDto> {
    try {
      const get_user = await this.findOne(user);
      delete get_user.password;
      return get_user;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async editProfile(user: User, profileDto: ProfileDto): Promise<ProfileDto> {
    try {
      const get_user = await this.findOne(user);
      delete get_user.password;
      if (!user) throw new NotFoundException();
      return await this.save({ ...get_user, ...profileDto });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
