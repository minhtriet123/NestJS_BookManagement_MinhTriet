import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
  imports: [UsersModule],
  controllers: [SmsController],
  providers: [SmsService]
})
export class SmsModule {}
