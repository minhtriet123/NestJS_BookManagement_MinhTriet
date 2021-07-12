import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDto } from './dto/category.dto';

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  async createCategory(createCategoryDto: CategoryDto): Promise<CategoryDto> {
    const { name } = createCategoryDto;
    const category = await this.create({
      name,
    });
    try {
      return await this.save(category);
    } catch (error) {
      return error.message;
    }
  }
}
