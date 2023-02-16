import Category from '@catalog/domain/Category';

export type DefaultCategoryParams = {
  name: string;
  code: string;
}

export type CreateCategoryParams = Pick<DefaultCategoryParams, 'name'>;

export type UpdateCategoryParams = Partial<DefaultCategoryParams>;

interface ICategoryService {
  getAllCategories(): Promise<Category[]>;

  createCategory(params: CreateCategoryParams): Promise<Category>;

  updateCategory(categoryId: string, params: UpdateCategoryParams): Promise<Category>;
}

export default ICategoryService;
