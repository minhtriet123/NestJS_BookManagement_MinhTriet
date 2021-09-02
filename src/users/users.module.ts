import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookStrategy } from 'src/auth/facebook.strategy';
import { GoogleStrategy } from 'src/auth/google.strategy';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    FilesModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_JWT'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, GoogleStrategy, FacebookStrategy],
  exports: [JwtStrategy, PassportModule, UsersService],
})
export class UsersModule {}
