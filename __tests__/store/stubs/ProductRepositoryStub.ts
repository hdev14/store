import Category from '@catalog/domain/Category';
import IProductRepository from '@catalog/domain/IProductRepository';
import Product from '@catalog/domain/Product';
import { fakeCategories, fakeProducts } from '../fakes';

export default class RepositoryStub implements IProductRepository {
  getCategoryById(categoryId: string): Category | Promise<Category | null> | null {
    return fakeCategories.find((c) => c.id === categoryId) as Category;
  }

  getAllCategories(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  addCategory(_: Category): Category | Promise<Category> {
    throw new Error('Method not implemented.');
  }

  updateCategory(_: Category): Category | Promise<Category> {
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

  addProduct(product: Product): Product | Promise<Product> {
    fakeProducts.push(product);
    return product;
  }

  updateProduct(product: Product): Product | Promise<Product> {
    const index = fakeProducts.findIndex((p) => p.id === product.id);

    fakeProducts[index] = product;

    return product;
  }
}
