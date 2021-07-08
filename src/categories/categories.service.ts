import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoryRepository: CategoriesRepository,
  ) {}
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryDto> {
    return this.categoryRepository.createCategory(createCategoryDto);
  }
  async deleteCategory(id: string) {
    const result = await this.categoryRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException(`No category with ID ${id} is not found`);
    return result;
  }
  async updateCategory(id: string, editcategory: CreateCategoryDto) {
    const { name } = editcategory;
    const category = await this.categoryRepository.findOne({ id });
    category.name = name;
    await this.categoryRepository.save(category);
    return category;
  }
}
