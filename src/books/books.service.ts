import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksRepository } from './books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { GetBookDto } from './dto/get-book.dto';
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

  async getBooksByFilter(booksFilterDto: GetBookFilterDto) {
    return this.booksRepository.getBooksByFilter(booksFilterDto);
  }
  async getAllBooks(title: string): Promise<GetBookDto[]> {
    return this.booksRepository.getBooks(title);
  }
  async getBookById(id: string) {
    const found = await this.booksRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`No Book with ID: ${id} is found`);
    }
    return found;
  }

  async deleteBook(id: string) {
    const result = await this.booksRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException(`No book with ID ${id} is found`);
    return result;
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const { title, author_id, category_id, price, description } = updateBookDto;
    const book = await this.getBookById(id);
    if (title) book.title = title;
    if (author_id) book.author.id = author_id;
    if (category_id) book.category.id = category_id;
    if (price) book.price = price;
    if (description) book.description = description;
    book.updatedAt = new Date();
    await this.booksRepository.save(book);
    return book;
  }
}
