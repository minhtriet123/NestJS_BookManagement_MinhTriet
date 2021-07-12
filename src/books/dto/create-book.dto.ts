import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  author_id: string;

  @IsString()
  category_id: string;

  @IsNumberString()
  publish_year: string;

  @IsNotEmpty()
  price: number;

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
