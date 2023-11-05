import Category, { CategoryProps } from '@catalog/domain/Category';
import { ICategoryOperations } from '@catalog/domain/IProductRepository';
import crypto from 'crypto';
import CategoryNotFoundError from './CategoryNotFoundError';
import ICategoryService, { CreateCategoryParams, UpdateCategoryParams } from './ICategoryService';

export default class CategoryService implements ICategoryService {
  constructor(
    private readonly repository: ICategoryOperations,
  ) { }

  public async getAllCategories(): Promise<CategoryProps[]> {
    const categories = await this.repository.getAllCategories();

    const results: CategoryProps[] = [];

    for (const category of categories) {
      results.push(category.toObject());
    }

    return results;
  }

  public async createCategory(params: CreateCategoryParams): Promise<CategoryProps> {
    const quantity = await this.repository.countCategories();

    const category = new Category({
      id: crypto.randomUUID(),
      name: params.name,
      code: quantity + 1,
    });

    await this.repository.addCategory(category);

    return category.toObject();
  }

  public async updateCategory(categoryId: string, params: UpdateCategoryParams): Promise<CategoryProps> {
    const current_category = await this.repository.getCategoryById(categoryId);

    if (!current_category) {
      throw new CategoryNotFoundError();
    }

    const props = {
      ...current_category,
      ...params,
    } as CategoryProps;

    const category = new Category(props);

    await this.repository.updateCategory(category);

    return category.toObject();
  }
}
