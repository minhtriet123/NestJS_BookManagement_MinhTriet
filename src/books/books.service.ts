import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksRepository } from './books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BooksRepository)
    private booksRepository: BooksRepository,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    return this.booksRepository.createBook(createBookDto);
  }

  async getBooksByFilter(booksFilterDto: GetBookFilterDto): Promise<Book[]> {
    return this.booksRepository.getBooksByFilter(booksFilterDto);
  }
  async getAllBooks(title: string): Promise<Book[]> {
    return this.booksRepository.getBooks(title);
  }
  async getBookById(id: string): Promise<Book> {
    const found = await this.booksRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['author', 'category'],
    });
    if (!found) {
      throw new NotFoundException(`No Book with ID: ${id} is found`);
    }
    return found;
  }

  async deleteBook(id: string): Promise<Book> {
    const found = await this.booksRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!found) {
      throw new NotFoundException(`No Book with ID: ${id} is found`);
    }
    found.is_deleted = true;
    return this.booksRepository.save(found);
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const { title, authorId, categoryId, price, description } = updateBookDto;
    const book = await this.booksRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['author', 'category'],
    });
    if (!book) throw new NotFoundException(`No Book with ID: ${id} is found`);
    if (title) book.title = title;
    if (authorId) book.author.id = authorId;
    if (categoryId) book.category.id = categoryId;
    if (price) book.price = price;
    if (description) book.description = description;
    return await this.booksRepository.save(book);
  }
}
