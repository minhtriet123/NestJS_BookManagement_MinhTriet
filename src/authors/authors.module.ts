import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthorsController } from './authors.controller';
import { AuthorsRepository } from './authors.repository';
import { AuthorsService } from './authors.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorsRepository]), UsersModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
