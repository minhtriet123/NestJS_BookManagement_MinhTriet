import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { email, password, firstName, lastName, avatar } = createUserDto;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    // hash password
    //const salt = await bcrypt.gensalt();
    //const hashPassword = await bcrypt.hash(password, salt);

    //console.log(salt);
    const user = this.create({
      email,
      password: hash,
      firstName,
      lastName,
      avatar,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Email already exists');
      else {
        throw new InternalServerErrorException();
      }
    }
  }
}
