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

  public async addCategory(category: Category): Promise<void> {
    fakeCategories.push(category);
  }

  public async updateCategory(category: Category): Promise<void> {
    const index = fakeCategories.findIndex((c) => c.id === category.id);

    fakeCategories[index] = category;
  }
}

export default new RepositoryStub();
