import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryDto> {
    const { name } = createCategoryDto;
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
