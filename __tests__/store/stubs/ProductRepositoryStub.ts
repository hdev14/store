import Category from '@catalog/domain/Category';
import IProductRepository from '@catalog/domain/IProductRepository';
import Product from '@catalog/domain/Product';
import { fakeCategories, fakeProducts } from '../fakes';

export class RepositoryStub implements IProductRepository {
  getCategoryById(categoryId: string): Promise<Category | null> {
    const category = fakeCategories.find((c) => c.id === categoryId);

    if (!category) {
      return Promise.resolve(null);
    }

    return Promise.resolve(category as any);
  }

  getAllCategories(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  addCategory(_: Category): Promise<void> {
    throw new Error('Method not implemented.');
  }

  updateCategory(_: Category): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getAllProducts(): Promise<Product[]> {
    return Promise.resolve(fakeProducts as any);
  }

  getProductById(id: string): Promise<Product | null> {
    return Promise.resolve(fakeProducts.find((p) => p.id === id) as any);
  }

  getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Promise.resolve(fakeProducts.filter((p) => p.category.id === categoryId) as any);
  }

  addProduct(product: Product): Promise<void> {
    fakeProducts.push(product as any);
    return Promise.resolve();
  }

  updateProduct(product: Product): Promise<void> {
    const index = fakeProducts.findIndex((p) => p.id === product.id);

    fakeProducts[index] = product as any;

    return Promise.resolve();
  }
}

export default new RepositoryStub();
