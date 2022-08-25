import Category, { CategoryParams } from '@catalog/domain/Category';
import { ICategoryOperations } from '@catalog/domain/IProductRepository';
import IGenerateID from '@shared/utils/IGenerateID';
import CategoryNotFoundError from './CategoryNotFoundError';
import ICategoryService, { CreateCategoryParams, UpdateCategoryParams } from './ICategoryService';

export default class CategoryService implements ICategoryService {
  private repository: ICategoryOperations;

  private generateID: IGenerateID;

  constructor(repository: ICategoryOperations, generateID: IGenerateID) {
    this.repository = repository;
    this.generateID = generateID;
  }

  public async getAllCategories(): Promise<Category[]> {
    const categories = await this.repository.getAllCategories();

    return categories;
  }

  public async createCategory(params: CreateCategoryParams): Promise<Category> {
    const allCategories = await this.repository.getAllCategories();

    const category = await this.repository.addCategory(new Category({
      id: this.generateID(),
      name: params.name,
      code: allCategories.length + 1,
    }));

    return category;
  }

  public async updateCategory(categoryId: string, params: UpdateCategoryParams): Promise<Category> {
    const currentCategory = await this.repository.getCategoryById(categoryId);

    if (!currentCategory) {
      throw new CategoryNotFoundError();
    }

    const categoryParams = {
      ...currentCategory,
      ...params,
    } as CategoryParams;

    const category = new Category(categoryParams);

    const updatedCategory = await this.repository.updateCategory(category);

    return updatedCategory;
  }
}
