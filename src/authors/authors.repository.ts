import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Author } from './author.entity';
import { AuthorDto } from './dto/author.dto';

@EntityRepository(Author)
export class AuthorsRepository extends Repository<Author> {
  private logger = new Logger();
  async createAuthor(createAuthorDto: AuthorDto): Promise<AuthorDto> {
    const { name } = createAuthorDto;
    const category = await this.create({
      name,
    });
    try {
      return await this.save(category);
    } catch (error) {
      this.logger.error(
        `Fail to create author.Error message: ${error.message}`,
      );
      throw new InternalServerErrorException(`Error: Fail to create author`);
    }
  }
}
