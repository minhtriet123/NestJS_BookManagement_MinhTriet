import { IsOptional, IsString } from 'class-validator';

export class GetBookFilterDto {
  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  category?: string;
}
