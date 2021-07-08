import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { BooksController } from './books.controller';
import { BooksRepository } from './books.repository';
import { BooksService } from './books.service';

@Module({
  imports: [TypeOrmModule.forFeature([BooksRepository]), UsersModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
