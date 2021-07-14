import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesRepository } from './categories.repository';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoryRepository: CategoriesRepository,
  ) {}
  async createCategory(createCategoryDto: CategoryDto): Promise<CategoryDto> {
    return this.categoryRepository.createCategory(createCategoryDto);
  }
  async deleteCategory(id: string) {
    const result = await this.categoryRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!result)
      throw new NotFoundException(`No category with ID ${id} is found`);
    result.is_deleted = true;
    return await this.categoryRepository.save(result);
  }
  async updateCategory(id: string, editcategory: CategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!category) {
      throw new NotFoundException(`No category with ID ${id} is found`);
    }
    return await this.categoryRepository.save({ ...category, ...editcategory });
  }
}
