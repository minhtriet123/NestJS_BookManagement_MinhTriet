import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
  async getAuthors(search?: string): Promise<Author[]> {
    const query = this.authorRepository
      .createQueryBuilder('author')
      .where('author.is_deleted = :isDeleted', { isDeleted: false });
    if (search) {
      if (parseInt(search)) {
        query.andWhere(`(author.id=:search)`, { search: search });
      } else {
        query.andWhere('(LOWER(author.name) LIKE LOWER(:search))', {
          search: `%${search}%`,
        });
      }
    }
    try {
      const authors = await query.getMany();
      return authors;
    } catch (e) {
      throw new InternalServerErrorException('Fail get author');
    }
  }
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
  async updateAuthor(id: string, editAuthor: AuthorDto): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!author) throw new NotFoundException(`No author was found`);
    return await this.authorRepository.save({ ...author, ...editAuthor });
  }
}
