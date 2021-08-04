import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { LoginStatus } from 'src/auth/loginStatus.enum';

export class UpdatePasswordDto {
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: LoginStatus.WEAK_PASSWORD,
  })
  newPassword: string;

  @IsString()
  confirmNewPassword: string;
}
