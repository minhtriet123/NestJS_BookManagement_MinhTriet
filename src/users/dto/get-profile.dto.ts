import { IsEmail, IsString } from 'class-validator';

export class GetProfile {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  avatar: string;
}
