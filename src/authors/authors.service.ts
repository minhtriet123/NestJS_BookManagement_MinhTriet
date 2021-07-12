import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorsRepository } from './authors.repository';
import { AuthorDto } from './dto/author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(AuthorsRepository)
    private authorRepository: AuthorsRepository,
  ) {}
  async createAuthor(createAuthorDto: AuthorDto): Promise<AuthorDto> {
    return this.authorRepository.createAuthor(createAuthorDto);
  }
  async deleteAuthor(id: string) {
    const result = await this.authorRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException(`No author with ID ${id} is not found`);
    return result;
  }
  async updateAuthor(id: string, editAuthor: AuthorDto) {
    const { name } = editAuthor;
    const author = await this.authorRepository.findOne({ id });
    author.name = name;
    await this.authorRepository.save(author);
    return author;
  }
}
