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
      authorId,
      categoryId,
      publishYear,
      price,
      description,
      cover,
    } = createBookDto;
    const book = this.create({
      title,
      publish_year: publishYear,
      price: price,
      description: description,
      cover: cover,
      author: { id: authorId },
      category: { id: categoryId },
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
    let listBooksReturn = this.mappingBooks(listBooks);
    if (title)
      listBooksReturn = listBooksReturn.filter((s) => s.title.includes(title));
    return listBooksReturn;
  }
  async getBooksByFilter(
    getBooksFilterDto: GetBookFilterDto,
  ): Promise<GetBookDto[]> {
    const { author, category } = getBooksFilterDto;
    let listBooks = await this.getBooks();
    if (author)
      listBooks = listBooks.filter((s) => s.authorName.includes(author));
    if (category)
      listBooks = listBooks.filter((s) => s.categoryName.includes(category));
    return listBooks;
  }

  mappingBooks(listBooks: Book[]): GetBookDto[] {
    return listBooks.map((book) => ({
      id: book.id,
      title: book.title,
      publishYear: book.publish_year,
      cover: book.cover,
      authorName: book.author.name,
      categoryName: book.category.name,
    }));
  }
}
