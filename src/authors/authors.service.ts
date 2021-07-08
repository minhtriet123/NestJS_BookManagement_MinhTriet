import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { Author } from './author.entity';
import { AuthorsRepository } from './authors.repository';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(AuthorsRepository)
    private authorRepository: AuthorsRepository,
  ) {}
  async createAuthor(
    createAuthorDto: CreateAuthorDto,
  ): Promise<CreateAuthorDto> {
    return this.authorRepository.createAuthor(createAuthorDto);
  }
  async deleteAuthor(id: string) {
    const result = await this.authorRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException(`No author with ID ${id} is not found`);
    return result;
  }
  async updateAuthor(id: string, editAuthor: CreateAuthorDto) {
    const { name } = editAuthor;
    const author = await this.authorRepository.findOne({ id });
    author.name = name;
    await this.authorRepository.save(author);
    return author;
  }
}
