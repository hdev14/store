import Category from '@catalog/domain/Category';
import { ICategoryOperations } from '@catalog/domain/IProductRepository';
import { fakeCategories } from '../fakes';

export class RepositoryStub implements ICategoryOperations {
  getCategoryById(categoryId: string): Promise<Category | null> {
    const category = fakeCategories.find((c) => c.id === categoryId);

    if (!category) {
      return Promise.resolve(null);
    }

    return Promise.resolve(category as Category);
  }

  getAllCategories(): Promise<Category[]> {
    return Promise.resolve(fakeCategories as any);
  }

  addCategory(category: Category): Promise<Category> {
    fakeCategories.push(category);

    return Promise.resolve(category);
  }

  updateCategory(category: Category): Promise<Category> {
    const index = fakeCategories.findIndex((c) => c.id === category.id);

    fakeCategories[index] = category;

    return Promise.resolve(category);
  }
}

export default new RepositoryStub();
