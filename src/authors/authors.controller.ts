import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Controller('authors')
@UseGuards(AuthGuard('jwt'))
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}
  @Post('/create-author')
  createCategory(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.createAuthor(createAuthorDto);
  }

  @Delete('/:id')
  deteleBook(@Param('id') id: string) {
    return this.authorsService.deleteAuthor(id);
  }

  @Put('/:id')
  updateAuthor(@Param('id') id: string, @Body() editAuthor: CreateAuthorDto) {
    return this.authorsService.updateAuthor(id, editAuthor);
  }
}
