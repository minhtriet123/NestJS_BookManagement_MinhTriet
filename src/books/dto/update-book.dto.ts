import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  authorId?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
