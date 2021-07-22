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
import { Pagination } from 'nestjs-typeorm-paginate';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('api/books')
@UseGuards(AuthGuard('jwt'))
export class BooksController {
  constructor(private booksService: BooksService) {}
  //@Get()
  //getAllBooks(@Query('search') title: string): Promise<Book[]> {
  //  return this.booksService.getAllBooks(title);
  //}

  @Get()
  index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') title: string,
  ): Promise<Pagination<Book>> {
    return this.booksService.paginate(
      {
        page: Number(page),
        limit: Number(limit),
        route: '/api/books',
      },
      title,
    );
  }

  @Get('/filter')
  getBooksByFilter(
    @Query() getBookFilterDto: GetBookFilterDto,
  ): Promise<Book[]> {
    return this.booksService.getBooksByFilter(getBookFilterDto);
  }

  @Get('/:id')
  getBookById(@Param('id') id: string): Promise<Book> {
    return this.booksService.getBookById(id);
  }

  @Post('/create-book')
  createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.createBook(createBookDto);
  }

  @Delete('/:id')
  deteleBook(@Param('id') id: string): Promise<Book> {
    return this.booksService.deleteBook(id);
  }

  @Patch('/:id/edit')
  updateBook(
    @Param('id') id: string,
    @Body() updateBook: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.updateBook(id, updateBook);
  }
}
