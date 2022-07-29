import ProductService from '../../../src/catalog/app/ProductService';
import Category from '../../../src/catalog/domain/Category';
import { IProductOperations } from '../../../src/catalog/domain/IProductRepository';
import Product from '../../../src/catalog/domain/Product';

const fakeProducts = [{
  id: 'test_product_id_1',
  name: 'test_product_1',
  description: 'test_product_1',
  amount: Math.random() * 100,
  image: 'http://example.com',
  stockQuantity: parseInt((Math.random() * 10).toFixed(0), 10),
  createdAt: new Date(),
  dimensions: {
    height: Math.random() * 50,
    width: Math.random() * 50,
    depth: Math.random() * 50,
  },
  category: {
    id: 'test_category_id_1',
    name: 'test_category_1',
    code: 123,
  },
}];

class RepositoryStub implements IProductOperations {
  getAllProducts(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  getProductById(id: string): Promise<Product | null> {
    return Promise.resolve(fakeProducts.find((p) => p.id === id) as any);
  }

  getProductsByCategory(_: Category): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  addProduct(_: Product): Product | Promise<Product> {
    throw new Error('Method not implemented.');
  }

  updateProduct(_: Product): Product | Promise<Product> {
    throw new Error('Method not implemented.');
  }
}

describe('ProductsService\'s unit tests', () => {
  it('returns a product by id', async () => {
    expect.assertions(9);

    const repositoryStub = new RepositoryStub();
    const productService = new ProductService(repositoryStub);

    const product = await productService.getProductById('test_product_id_1');

    expect(product.id).toEqual(fakeProducts[0].id);
    expect(product.name).toEqual(fakeProducts[0].name);
    expect(product.description).toEqual(fakeProducts[0].description);
    expect(product.amount).toEqual(fakeProducts[0].amount);
    expect(product.image).toEqual(fakeProducts[0].image);
    expect(product.stockQuantity).toEqual(fakeProducts[0].stockQuantity);
    expect(product.createdAt).toEqual(fakeProducts[0].createdAt);
    expect(product.dimensions).toEqual(fakeProducts[0].dimensions);
    expect(product.category).toEqual(fakeProducts[0].category);
  });
});
