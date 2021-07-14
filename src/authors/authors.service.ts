import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
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
  async deleteAuthor(id: string): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!author) throw new NotFoundException(`No author id ${id} was found`);
    author.is_deleted = true;
    return this.authorRepository.save(author);
  }
  async updateAuthor(id: string, editAuthor: AuthorDto) {
    const author = await this.authorRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!author) throw new NotFoundException(`No author was found`);
    return await this.authorRepository.save({ ...author, ...editAuthor });
  }
}
