import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsNumberString()
  @IsNotEmpty()
  authorId: string;

  @IsNumberString()
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
