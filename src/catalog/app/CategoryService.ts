import Category from '../domain/Category';
import ICategoryService, { CreateCategoryParams, UpdateCategoryParams } from './ICategoryService';

export default class CategoryService implements ICategoryService {
  getAllCategories(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  createCategory(params: CreateCategoryParams): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  updateCategory(categoryId: string, params: UpdateCategoryParams): Promise<Category> {
    throw new Error('Method not implemented.');
  }
}
