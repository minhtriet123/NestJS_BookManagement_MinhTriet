import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';

@EntityRepository(Author)
export class AuthorsRepository extends Repository<Author> {
  async createAuthor(
    createAuthorDto: CreateAuthorDto,
  ): Promise<CreateAuthorDto> {
    const { name } = createAuthorDto;
    const category = await this.create({
      name,
    });
    try {
      await this.save(category);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return category;
  }
}
