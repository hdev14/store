import Category from '@catalog/domain/Category';
import IProductRepository from '@catalog/domain/IProductRepository';
import Product from '@catalog/domain/Product';
import { fakeCategories, fakeProducts } from '../fakes';

export class RepositoryStub implements IProductRepository {
  public async getCategoryById(categoryId: string): Promise<Category | null> {
    const category = fakeCategories.find((c) => c.id === categoryId);

    if (!category) {
      return Promise.resolve(null);
    }

    return Promise.resolve(category as Category);
  }

  public async getAllCategories(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  public async addCategory(_: Category): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async updateCategory(_: Category): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async getAllProducts(): Promise<Product[]> {
    return Promise.resolve(fakeProducts as any);
  }

  public async getProductById(id: string): Promise<Product | null> {
    return Promise.resolve(fakeProducts.find((p) => p.id === id) as any);
  }

  public async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Promise.resolve(fakeProducts.filter((p) => p.category.id === categoryId) as any);
  }

  public async addProduct(product: Product): Promise<void> {
    fakeProducts.push(product);
  }

  public async updateProduct(product: Product): Promise<void> {
    const index = fakeProducts.findIndex((p) => p.id === product.id);

    fakeProducts[index] = product;
  }
}

export default new RepositoryStub();
