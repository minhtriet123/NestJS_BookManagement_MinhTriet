import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PublicFile } from './file.entity';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
