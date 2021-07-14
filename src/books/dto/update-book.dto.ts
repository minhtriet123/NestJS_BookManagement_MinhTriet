import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  authorId?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsNumberString()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
