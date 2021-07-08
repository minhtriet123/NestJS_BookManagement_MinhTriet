import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateAuthorDto } from 'src/authors/dto/create-author.dto';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { GetBookDto } from './dto/get-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
@UseGuards(AuthGuard('jwt'))
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Get()
  getAllBooks(): Promise<GetBookDto[]> {
    return this.booksService.getAllBooks();
  }

  @Get('/search')
  getBooksByTitle(@Query('name') title: string) {
    return this.booksService.getBooksByName(title);
  }

  @Get('/filter')
  getBooksByFilter(@Query() getBookFilterDto: GetBookFilterDto) {
    return this.booksService.getBooksByFilter(getBookFilterDto);
  }

  @Get('/:id')
  getBookById(@Param('id') id: string) {
    return this.booksService.getBookById(id);
  }

  @Post('/create-book')
  createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.createBook(createBookDto);
  }

  @Delete('/:id')
  deteleBook(@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }

  @Patch('/:id/edit')
  updateBook(@Param('id') id: string, @Body() updateBook: UpdateBookDto) {
    return this.booksService.updateBook(id, updateBook);
  }
}
