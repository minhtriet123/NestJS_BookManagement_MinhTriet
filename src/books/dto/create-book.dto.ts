import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  author_id: string;

  @IsString()
  category_id: string;

  @IsString()
  publish_year: string;

  @IsString()
  price: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  updatedAt?: string;
}
