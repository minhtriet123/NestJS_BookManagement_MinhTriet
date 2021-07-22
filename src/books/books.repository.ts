import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { loggerApp } from 'src/logger.enum/logger.enum';
import { EntityRepository, Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';

@EntityRepository(Book)
export class BooksRepository extends Repository<Book> {
  private logger = new Logger('BooksRepository', true);
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
      return await this.save(book);
    } catch (error) {
      if (error.code === loggerApp.NO_PRESENT_CODE)
        throw new ConflictException(loggerApp.NO_PRESENT);
      throw new InternalServerErrorException();
    }
  }

  // async getBooks(title?: string): Promise<Book[]> {
  //   const query = this.createQueryBuilder('book')
  //     .leftJoinAndSelect('book.author', 'author')
  //     .leftJoinAndSelect('book.category', 'category')
  //     .where('book.is_deleted = :isDeleted', { isDeleted: false });
  //   if (title) {
  //     query.andWhere('(LOWER(book.title) LIKE LOWER(:title))', {
  //       title: `%${title}%`,
  //     });
  //   }
  //   try {
  //     const books = await query.getMany();
  //     return books;
  //   } catch (e) {
  //     this.logger.error(loggerApp.NO_PRESENT, e.stack);
  //     throw new InternalServerErrorException();
  //   }
  // }
  async getBooksByFilter(getBooksFilterDto: GetBookFilterDto): Promise<Book[]> {
    const { author, category } = getBooksFilterDto;
    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.category', 'category');
    query.where('book.is_deleted = :isDeleted', { isDeleted: false });
    if (author) {
      query.andWhere('(LOWER(author.name) LIKE LOWER(:authorName))', {
        authorName: `%${author}%`,
      });
    }
    if (category) {
      query.andWhere('(LOWER(category.name) LIKE LOWER(:categoryName))', {
        categoryName: `%${category}%`,
      });
    }
    try {
      const books = await query.getMany();
      return books;
    } catch (e) {
      this.logger.error(loggerApp.NO_PRESENT, e.stack);
      throw new InternalServerErrorException();
    }
  }
}
