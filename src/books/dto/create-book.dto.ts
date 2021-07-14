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
  authorId: string;

  @IsString()
  categoryId: string;

  @IsNumberString()
  publishYear: string;

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
