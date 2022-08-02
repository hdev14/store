import Category from '../../src/catalog/domain/Category';
import { ICategoryOperations } from '../../src/catalog/domain/IProductRepository';
import { fakeCategories } from '../fakes';

export default class RepositoryStub implements ICategoryOperations {
  getCategoryById(categoryId: string): Promise<Category | null> | Category | null {
    const category = fakeCategories.find((c) => c.id === categoryId);

    if (!category) {
      return null;
    }

    return category as Category;
  }

  getAllCategories(): Promise<Category[]> {
    return Promise.resolve(fakeCategories as any);
  }

  addCategory(category: Category): Category | Promise<Category> {
    fakeCategories.push(category);

    return category;
  }

  updateCategory(category: Category): Category | Promise<Category> {
    const index = fakeCategories.findIndex((c) => c.id === category.id);

    fakeCategories[index] = category;

    return category;
  }
}
