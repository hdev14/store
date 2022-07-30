import Category from '../domain/Category';
import { ICategoryOperations } from '../domain/IProductRepository';
import ICategoryService, { CreateCategoryParams, UpdateCategoryParams } from './ICategoryService';
import IGenerateID from './IGenerateID';

export default class CategoryService implements ICategoryService {
  private repository: ICategoryOperations;

  private generateID: IGenerateID;

  constructor(repository: ICategoryOperations, generateID: IGenerateID) {
    this.repository = repository;
    this.generateID = generateID;
  }

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
