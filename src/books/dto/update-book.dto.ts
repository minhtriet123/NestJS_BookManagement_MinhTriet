import { IsOptional, IsString } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  authorId?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
