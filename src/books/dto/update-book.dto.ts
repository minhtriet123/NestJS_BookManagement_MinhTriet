import { IsOptional, IsString } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author_id?: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
