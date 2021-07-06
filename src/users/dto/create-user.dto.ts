import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserCredentialDto } from './user-credential.dto';

export class CreateUserDto extends UserCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  confirmPassword: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
