import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  authorId: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: string;

  @IsNumberString()
  publishYear: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cover?: string;
}
