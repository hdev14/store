import { CategoryProps } from '@catalog/domain/Category';

export type DefaultCategoryParams = {
  name: string;
  code: string;
}

export type CreateCategoryParams = Pick<DefaultCategoryParams, 'name'>;

export type UpdateCategoryParams = Partial<DefaultCategoryParams>;

interface ICategoryService {
  getAllCategories(): Promise<CategoryProps[]>;

  createCategory(params: CreateCategoryParams): Promise<CategoryProps>;

  updateCategory(category_id: string, params: UpdateCategoryParams): Promise<CategoryProps>;
}

export default ICategoryService;
