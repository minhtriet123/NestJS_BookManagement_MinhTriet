import { IsString } from 'class-validator';

export class AuthorDto {
  @IsString()
  name: string;
}
