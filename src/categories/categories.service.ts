import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesRepository } from './categories.repository';
import { Category } from './category.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoryRepository: CategoriesRepository,
  ) {}
  async getCategories(search?: string): Promise<Category[]> {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.is_deleted = :isDeleted', { isDeleted: false });
    if (search) {
      if (parseInt(search)) {
        query.andWhere(`(category.id=:search)`, { search: search });
      } else {
        query.andWhere('(LOWER(category.name) LIKE LOWER(:search))', {
          search: `%${search}%`,
        });
      }
    }
    try {
      const categories = await query.getMany();
      return categories;
    } catch (e) {
      throw new InternalServerErrorException('Fail get category');
    }
  }
  async createCategory(createCategoryDto: CategoryDto): Promise<CategoryDto> {
    return this.categoryRepository.createCategory(createCategoryDto);
  }
  async deleteCategory(id: string): Promise<Category> {
    const result = await this.categoryRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!result)
      throw new NotFoundException(`No category with ID ${id} is found`);
    result.is_deleted = true;
    return await this.categoryRepository.save(result);
  }
  async updateCategory(
    id: string,
    editcategory: CategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!category) {
      throw new NotFoundException(`No category with ID ${id} is found`);
    }
    return await this.categoryRepository.save({ ...category, ...editcategory });
  }
}
