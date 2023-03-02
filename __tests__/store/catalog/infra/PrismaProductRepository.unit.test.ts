/* eslint-disable import/prefer-default-export */
import PrismaProductRepository from '@catalog/infra/persistence/PrismaProductRepository';
import Product from '@catalog/domain/Product';
import Category from '@catalog/domain/Category';
import Dimensions from '@catalog/domain/Dimensions';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import RepositoryError from '@shared/errors/RepositoryError';

const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

jest.mock('@prisma/client/index', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

describe('PrismaProductRepository\'s Unit Tests', () => {
  describe('PrismaProductRepository.addProduct()', () => {
    it('adds a new product', async () => {
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

      await productRepository.addProduct(product);

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

    it('throws a RepositoryError if occur an unexpected error', async () => {
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

      const productRepository = new PrismaProductRepository();

      prismaMock.product.create.mockRejectedValueOnce(new Error('test'));

      try {
        await productRepository.addProduct(product);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaProductRepository - test');
      }
    });
  });

  describe('PrismaProductRepository.updateProduct()', () => {
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

    it('throws a RepositoryError if occur an unexpected error', async () => {
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

      prismaMock.product.update.mockRejectedValueOnce(new Error('test'));

      const productRepository = new PrismaProductRepository();

      try {
        await productRepository.updateProduct(product);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaProductRepository - test');
      }
    });
  });

  describe('PrismaProductRepository.addCategory()', () => {
    it('adds a new category', async () => {
      expect.assertions(2);

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

      await productRepository.addCategory(category);

      expect(prismaMock.category.create).toHaveBeenCalled();
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: {
          id: category.id,
          name: category.name,
          code: category.code,
        },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const productRepository = new PrismaProductRepository();
      const category = new Category({
        id: 'testid',
        name: 'test',
        code: 123,
      });

      prismaMock.category.create.mockRejectedValueOnce(new Error('test'));

      try {
        await productRepository.addCategory(category);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaProductRepository - test');
      }
    });
  });

  describe('PrismaProductRepository.updateCategory()', () => {
    it('updates a existing category', async () => {
      expect.assertions(2);

      const productRepository = new PrismaProductRepository();

      const category = new Category({
        id: 'testid',
        name: 'test',
        code: 1234,
      });

      prismaMock.category.update.mockResolvedValue({
        id: category.id,
        name: category.name,
        code: category.code,
      });

      await productRepository.updateCategory(category);

      expect(prismaMock.category.update).toHaveBeenCalled();
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: category.id },
        data: {
          name: category.name,
          code: category.code,
        },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const productRepository = new PrismaProductRepository();

      const category = new Category({
        id: 'testid',
        name: 'test',
        code: 1234,
      });

      prismaMock.category.update.mockRejectedValueOnce(new Error('test'));

      try {
        await productRepository.updateCategory(category);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaProductRepository - test');
      }
    });
  });

  describe('PrismaProductRepository.getAllProducts()', () => {
    it('returns all products', async () => {
      expect.assertions(4);

      const fakeCategory = {
        id: 'category_testid',
        name: 'category_test',
        code: 1234,
      };

      const fakeProducts = [1, 2, 3].map((index) => ({
        id: `testid${index}`,
        name: `test ${index}`,
        description: `test description ${index}`,
        amount: Math.random() * 100,
        height: index,
        width: index,
        depth: index,
        image: `http://test.com/${index}.jpg`,
        stockQuantity: 10,
        categoryId: fakeCategory.id,
        category: fakeCategory,
        createdAt: new Date().toISOString(),
      }));

      prismaMock.product.findMany.mockResolvedValue(fakeProducts as any);

      const productRepository = new PrismaProductRepository();

      const products = await productRepository.getAllProducts();

      expect(products.every((p) => (p instanceof Product))).toBe(true);
      expect(products).toHaveLength(3);
      expect(prismaMock.product.findMany).toHaveBeenCalled();
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        include: { category: true },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.product.findMany.mockRejectedValueOnce(new Error('test'));

      const productRepository = new PrismaProductRepository();

      try {
        await productRepository.getAllProducts();
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaProductRepository - test');
      }
    });
  });

  describe('PrismaProductRepository.getCategoryById()', () => {
    it('returns a specific category', async () => {
      expect.assertions(3);

      const fakeCategory = {
        id: 'test_category_id_1',
        name: 'test_category_1',
        code: 1234,
      };

      prismaMock.category.findUnique.mockResolvedValue(fakeCategory);

      const productRepository = new PrismaProductRepository();

      const category = await productRepository.getCategoryById('test_category_id_1');

      expect(category!.id).toEqual(fakeCategory.id);
      expect(prismaMock.category.findUnique).toHaveBeenCalled();
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'test_category_id_1' },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.category.findUnique.mockRejectedValueOnce(new Error('test'));

      const productRepository = new PrismaProductRepository();

      try {
        await productRepository.getCategoryById('test_category_id_1');
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaProductRepository - test');
      }
    });
  });

  describe('PrismaProductRepository.getProductById()', () => {
    it('returns a specific product', async () => {
      expect.assertions(3);

      const fakeCategory = {
        id: 'category_testid',
        name: 'category_test',
        code: 1234,
      };

      const fakeProduct = {
        id: 'testid',
        name: 'test',
        description: 'test description',
        amount: Math.random() * 100,
        height: Math.random() * 10,
        width: Math.random() * 10,
        depth: Math.random() * 10,
        image: 'http://test.com/test.jpg',
        stockQuantity: 10,
        categoryId: fakeCategory.id,
        category: fakeCategory,
        createdAt: new Date().toISOString(),
      };

      prismaMock.product.findUnique.mockResolvedValue(fakeProduct as any);

      const productRepository = new PrismaProductRepository();

      const product = await productRepository.getProductById('testid');

      expect(product!.id).toEqual(fakeProduct.id);
      expect(prismaMock.product.findUnique).toHaveBeenCalled();
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'testid' },
        include: { category: true },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.product.findUnique.mockRejectedValueOnce(new Error('test'));

      const productRepository = new PrismaProductRepository();

      try {
        await productRepository.getProductById('testid');
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaProductRepository - test');
      }
    });
  });

  test.todo('PrismaProductRepository.getProductsByCategory()');

  test.todo('PrismaProductRepository.getAllCategories()');
});
