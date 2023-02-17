import Category from '@catalog/domain/Category';
import Dimensions from '@catalog/domain/Dimensions';
import Product from '@catalog/domain/Product';
import { InMemoryProductRepository } from '@catalog/infra/persistence/InMemoryProductRepository';

describe('InMemoryProductRepository\'s Unit Tests', () => {
  it('adds a new product', () => {
    const fakeCategories = [{
      _id: 'category_testid',
      name: 'category_test',
      code: 123,
    },
    ];

    const productRepository = new InMemoryProductRepository([], fakeCategories);

    const product = new Product({
      id: 'testid',
      name: 'test',
      description: 'test description',
      amount: Math.random() * 100,
      dimensions: new Dimensions({ height: 1, width: 1, depth: 1 }),
      image: 'http://test.com/jpg',
      stockQuantity: 10,
      category: new Category({
        id: fakeCategories[0]._id,
        name: fakeCategories[0].name,
        code: fakeCategories[0].code,
      }),
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

  it('updates a existing product', () => {
    const createdAt = new Date();
    const fakeProducts = [{
      _id: 'testid',
      name: 'test',
      description: 'test description',
      amount: Math.random() * 100,
      height: 1,
      width: 1,
      depth: 1,
      image: 'http://test.com/jpg',
      stockQuantity: 10,
      category: 'category_testid',
      createdAt: createdAt.toISOString(),
    }];

    const fakeCategories = [{ _id: 'category_testid', name: 'category_test', code: 123 }];

    const productRepository = new InMemoryProductRepository(fakeProducts, fakeCategories);

    const product = new Product({
      id: fakeProducts[0]._id,
      name: fakeProducts[0].name,
      description: fakeProducts[0].description,
      amount: fakeProducts[0].amount,
      dimensions: new Dimensions({
        height: fakeProducts[0].height,
        width: fakeProducts[0].width,
        depth: fakeProducts[0].depth,
      }),
      image: fakeProducts[0].image,
      stockQuantity: fakeProducts[0].stockQuantity,
      category: new Category({
        id: fakeCategories[0]._id,
        name: fakeCategories[0].name,
        code: fakeCategories[0].code,
      }),
      createdAt,
    });

    productRepository.updateProduct(new Product({ ...product, name: 'updated test' }));

    const inMemoryProduct = productRepository.products.find((p) => p._id === product.id);

    expect(inMemoryProduct).toBeTruthy();
    expect(inMemoryProduct!.name).toEqual('updated test');
  });

  it('adds a new category', () => {
    const productRepository = new InMemoryProductRepository();
    const category = new Category({
      id: 'testid',
      name: 'test',
      code: 123,
    });

    productRepository.addCategory(category);

    const inMemoryCategory = productRepository.categories.find((p) => p._id === category.id);

    expect(inMemoryCategory).toBeTruthy();
    expect(inMemoryCategory!.name).toEqual(category.name);
    expect(inMemoryCategory!.code).toEqual(category.code);
  });

  it('updates a existing category', () => {
    const fakeCategories = [{
      _id: 'testid',
      name: 'test',
      code: 1234,
    }];

    const productRepository = new InMemoryProductRepository([], fakeCategories);

    const category = new Category({
      id: fakeCategories[0]._id,
      name: fakeCategories[0].name,
      code: fakeCategories[0].code,
    });

    productRepository.updateCategory(new Category({ ...category, name: 'updated test' }));

    const inMemoryCategory = productRepository.categories.find((p) => p._id === category.id);

    expect(inMemoryCategory).toBeTruthy();
    expect(inMemoryCategory!.name).toEqual('updated test');
  });

  it('returns all products', async () => {
    expect.assertions(1);

    const fakeCategories = [{
      _id: 'category_testid',
      name: 'category_test',
      code: 1234,
    }];

    const fakeProducts = [1, 2, 3].map((index) => ({
      _id: `testid${index}`,
      name: `test ${index}`,
      description: `test description ${index}`,
      amount: Math.random() * 100,
      height: index,
      width: index,
      depth: index,
      image: `http://test.com/${index}.jpg`,
      stockQuantity: 10,
      category: fakeCategories[0]._id,
      createdAt: new Date().toISOString(),
    }));

    const productRepository = new InMemoryProductRepository(fakeProducts, fakeCategories);

    const products = await productRepository.getAllProducts();

    expect(products).toHaveLength(3);
  });

  it('returns all categories', async () => {
    expect.assertions(1);

    const fakeCategories = [
      {
        _id: 'test_category_id_1',
        name: 'test_category_1',
        code: 123,
      },
      {
        _id: 'test_category_id_2',
        name: 'test_category_2',
        code: 321,
      },
    ];

    const productRepository = new InMemoryProductRepository([], fakeCategories);

    const categories = await productRepository.getAllCategories();

    expect(categories).toHaveLength(2);
  });

  it('returns a specific category', async () => {
    expect.assertions(2);

    const fakeCategories = [
      {
        _id: 'test_category_id_1',
        name: 'test_category_1',
        code: 123,
      },
      {
        _id: 'test_category_id_2',
        name: 'test_category_2',
        code: 321,
      },
    ];

    const productRepository = new InMemoryProductRepository([], fakeCategories);

    const category = await productRepository.getCategoryById('test_category_id_1');

    expect(category.name).toEqual('test_category_1');
    expect(category.code).toEqual(123);
  });

  it('returns a specific product', async () => {
    expect.assertions(9);

    const createdAt = new Date();
    const fakeProducts = [{
      _id: 'testid',
      name: 'test',
      description: 'test description',
      amount: Math.random() * 100,
      height: 1,
      width: 1,
      depth: 1,
      image: 'http://test.com/jpg',
      stockQuantity: 10,
      category: 'category_testid',
      createdAt: createdAt.toISOString(),
    }];

    const fakeCategories = [{ _id: 'category_testid', name: 'category_test', code: 123 }];

    const productRepository = new InMemoryProductRepository(fakeProducts, fakeCategories);

    const product = await productRepository.getProductById('testid');

    expect(product!.id).toEqual(fakeProducts[0]._id);
    expect(product!.name).toEqual(fakeProducts[0].name);
    expect(product!.description).toEqual(fakeProducts[0].description);
    expect(product!.amount).toEqual(fakeProducts[0].amount);
    expect(product!.image).toEqual(fakeProducts[0].image);
    expect(product!.stockQuantity).toEqual(fakeProducts[0].stockQuantity);
    expect(product!.createdAt).toEqual(createdAt);
    expect(product!.category).toEqual({
      id: fakeCategories[0]._id,
      name: fakeCategories[0].name,
      code: fakeCategories[0].code,
    });
    expect(product!.dimensions).toEqual({
      height: fakeProducts[0].height,
      width: fakeProducts[0].width,
      depth: fakeProducts[0].depth,
    });
  });
});
