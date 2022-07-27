import { prismaMock } from '../../../__mocks__/@prisma/client';
import PrismaProductRepository from '../../../src/catalog/infra/persistence/PrismaProductRepository';
import Product from '../../../src/catalog/domain/Product';
import Category from '../../../src/catalog/domain/Category';
import Dimensions from '../../../src/catalog/domain/Dimensions';

describe('PrismaProductRepository\'s Unit Tests', () => {
  it('adds a new product', async () => {
    expect.assertions(3);

    const product = new Product({
      id: 'test',
      name: 'test',
      description: 'test',
      amount: 123,
      dimensions: new Dimensions({
        height: 1,
        width: 2,
        depth: 3,
      }),
      image: 'https://example.com',
      stockQuantity: 10,
      category: new Category({
        id: 'test',
        name: 'test',
        code: 1234,
      }),
      createdAt: new Date(),
    });

    const productRepository = new PrismaProductRepository();

    prismaMock.product.create.mockResolvedValue({
      id: product.id,
      name: product.name,
      active: product.active,
      description: product.description,
      amount: product.amount,
      height: product.dimensions.height,
      width: product.dimensions.width,
      depth: product.dimensions.depth,
      image: product.image,
      stockQuantity: product.stockQuantity,
      categoryId: product.category.id,
      category: {
        id: product.category.id,
        name: product.category.name,
        code: product.category.code,
      },
      createdAt: product.createdAt,
    } as any);

    const result = await productRepository.addProduct(product);

    expect(result.id).toEqual(product.id);
    expect(prismaMock.product.create).toHaveBeenCalled();
    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: {
        id: product.id,
        name: product.name,
        active: product.active,
        description: product.description,
        amount: product.amount,
        height: product.dimensions.height,
        width: product.dimensions.width,
        depth: product.dimensions.depth,
        image: product.image,
        stockQuantity: product.stockQuantity,
        categoryId: product.category.id,
        createdAt: product.createdAt,
      },
      include: { category: true },
    });
  });

  it('updates a existing product', async () => {
    expect.assertions(2);

    const product = new Product({
      id: 'test',
      name: 'test',
      description: 'test',
      amount: 123,
      dimensions: new Dimensions({
        height: 1,
        width: 2,
        depth: 3,
      }),
      image: 'https://example.com',
      stockQuantity: 10,
      category: new Category({
        id: 'test',
        name: 'test',
        code: 1234,
      }),
      createdAt: new Date(),
    });

    prismaMock.product.update.mockResolvedValue({
      id: product.id,
      name: product.name,
      active: product.active,
      description: product.description,
      amount: product.amount,
      height: product.dimensions.height,
      width: product.dimensions.width,
      depth: product.dimensions.depth,
      image: product.image,
      stockQuantity: product.stockQuantity,
      categoryId: product.category.id,
      category: {
        id: product.category.id,
        name: product.category.name,
        code: product.category.code,
      },
      createdAt: product.createdAt,
    } as any);

    const productRepository = new PrismaProductRepository();

    await productRepository.updateProduct(product);

    expect(prismaMock.product.update).toHaveBeenCalled();
    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: product.id },
      data: {
        name: product.name,
        active: product.active,
        description: product.description,
        amount: product.amount,
        height: product.dimensions.height,
        width: product.dimensions.width,
        depth: product.dimensions.depth,
        image: product.image,
        stockQuantity: product.stockQuantity,
        categoryId: product.category.id,
        createdAt: product.createdAt,
      },
      include: { category: true },
    });
  });

  it('adds a new category', async () => {
    expect.assertions(3);

    const productRepository = new PrismaProductRepository();
    const category = new Category({
      id: 'testid',
      name: 'test',
      code: 123,
    });

    prismaMock.category.create.mockResolvedValue({
      id: category.id,
      name: category.name,
      code: category.code,
    });

    const result = await productRepository.addCategory(category);

    expect(result.isEqual(category)).toBe(true);
    expect(prismaMock.category.create).toHaveBeenCalled();
    expect(prismaMock.category.create).toHaveBeenCalledWith({
      data: {
        id: category.id,
        name: category.name,
        code: category.code,
      },
    });
  });

  // it('updates a existing category', () => {
  //   const fakeCategories = [{
  //     _id: 'testid',
  //     name: 'test',
  //     code: 1234,
  //   }];

  //   const productRepository = new InMemoryProductRepository([], fakeCategories);

  //   const category = new Category({
  //     id: fakeCategories[0]._id,
  //     name: fakeCategories[0].name,
  //     code: fakeCategories[0].code,
  //   });

  //   category.name = 'updated test';

  //   productRepository.updateCategory(category);

  //   const inMemoryCategory = productRepository.categories.find((p) => p._id === category.id);

  //   expect(inMemoryCategory).toBeTruthy();
  //   expect(inMemoryCategory!.name).toEqual('updated test');
  // });

  // it('returns all products', async () => {
  //   expect.assertions(1);

  //   const fakeCategories = [{
  //     _id: 'category_testid',
  //     name: 'category_test',
  //     code: 1234,
  //   }];

  //   const fakeProducts = [1, 2, 3].map((index) => ({
  //     _id: `testid${index}`,
  //     name: `test ${index}`,
  //     description: `test description ${index}`,
  //     amount: Math.random() * 100,
  //     height: index,
  //     width: index,
  //     depth: index,
  //     image: `http://test.com/${index}.jpg`,
  //     stockQuantity: 10,
  //     category: fakeCategories[0]._id,
  //     createdAt: new Date().toISOString(),
  //   }));

  //   const productRepository = new InMemoryProductRepository(fakeProducts, fakeCategories);

  //   const products = await productRepository.getAllProducts();

  //   expect(products).toHaveLength(3);
  // });
});
