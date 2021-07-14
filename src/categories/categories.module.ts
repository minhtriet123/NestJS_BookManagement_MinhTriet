import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesRepository]), UsersModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
