import Category from '../../../src/catalog/domain/Category';
import Dimensions from '../../../src/catalog/domain/Dimensions';
import Product from '../../../src/catalog/domain/Product';
import { InMemoryProductRepository } from '../../../src/catalog/infra/persistence/InMemoryProductRepository';

describe('InMemoryProductRepository\'s Unit Tests', () => {
  it('adds a new product', () => {
    const productRepository = new InMemoryProductRepository();
    const product = new Product({
      id: 'testid',
      name: 'test',
      description: 'test description',
      amount: Math.random() * 100,
      dimensions: new Dimensions({ height: 1, width: 1, depth: 1 }),
      image: 'http://test.com/jpg',
      stockQuantity: 10,
      category: new Category({ id: 'category_testid', name: 'category_test', code: 123 }),
      createdAt: new Date(),
    });

    productRepository.addProduct(product);

    const inMemoryProduct = productRepository.products.find((p) => p._id === product.id);

    expect(inMemoryProduct).toBeTruthy();
    expect(inMemoryProduct!.name).toEqual(product.name);
    expect(inMemoryProduct!.description).toEqual(product.description);
    expect(inMemoryProduct!.amount).toEqual(product.amount);
    expect(inMemoryProduct!.image).toEqual(product.image);
    expect(inMemoryProduct!.stockQuantity).toEqual(product.stockQuantity);
    expect(inMemoryProduct!.category).toEqual(product.category.id);
    expect(inMemoryProduct!.height).toEqual(product.dimensions.height);
    expect(inMemoryProduct!.width).toEqual(product.dimensions.width);
    expect(inMemoryProduct!.depth).toEqual(product.dimensions.depth);
    expect(inMemoryProduct!.createdAt).toEqual(product.createdAt.toISOString());
  });
});
