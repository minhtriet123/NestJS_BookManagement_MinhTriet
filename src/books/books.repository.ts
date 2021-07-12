import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { GetBookDto } from './dto/get-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
enum status {
  NO_PRESENT_CODE = '23503',
  NO_PRESENT = 'Error: no present record in parent table',
}
@EntityRepository(Book)
export class BooksRepository extends Repository<Book> {
  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const {
      title,
      author_id,
      category_id,
      publish_year,
      price,
      description,
      cover,
      updatedAt,
    } = createBookDto;
    const book = await this.create({
      title,
      publishYear: publish_year,
      price,
      description,
      cover,
      updatedAt,
      author: {
        id: author_id,
      },
      category: {
        id: category_id,
      },
    });
    try {
      await this.save(book);
      return book;
    } catch (error) {
      if (error.code === status.NO_PRESENT_CODE)
        throw new ConflictException(status.NO_PRESENT);
      else throw new InternalServerErrorException();
    }
  }

  async getBooks(title?: string): Promise<GetBookDto[]> {
    const listBooks = await this.find({
      relations: ['author', 'category'],
    });
    let listBooksReturn: GetBookDto[] = listBooks.map((book) => {
      return {
        id: book.id,
        title: book.title,
        publish_year: book.publishYear,
        cover: book.cover,
        author_name: book.author.name,
        category_name: book.category.name,
      };
    });
    if (title)
      listBooksReturn = listBooksReturn.filter((s) => s.title.includes(title));
    console.log(listBooksReturn);

    return listBooksReturn;
  }
  async getBooksByFilter(getBooksFilterDto: GetBookFilterDto) {
    const { author, category } = getBooksFilterDto;
    let listBooks = await this.getBooks();
    if (author)
      listBooks = listBooks.filter((s) => s.author_name.includes(author));
    if (category)
      listBooks = listBooks.filter((s) => s.category_name.includes(category));
    return listBooks;
  }
}
