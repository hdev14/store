import { IProductOperations } from '@catalog/domain/IProductRepository';
import Product from '@catalog/domain/Product';
import { fakeProducts } from '../fakes';

export default class RepositoryStub implements IProductOperations {
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
