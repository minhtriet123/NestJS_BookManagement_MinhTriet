import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { equals } from 'class-validator';
import { LoginStatus } from '../auth/loginStatus.enum';
import { GetProfileDto } from './dto/get-profile.dto';

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
  async getProfile(user: User): Promise<GetProfileDto> {
    try {
      const get_user = await this.findOne(user);
      const { email, firstName, lastName, avatar }: GetProfileDto = get_user;
      return { email, firstName, lastName, avatar };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
