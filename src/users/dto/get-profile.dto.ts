import { IsEmail, IsString } from 'class-validator';

export class GetProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  avatar: string;
}
