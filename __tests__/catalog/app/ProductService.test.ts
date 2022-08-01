/* eslint-disable max-classes-per-file */
import ProductService from '../../../src/catalog/app/ProductService';
import { IProductOperations } from '../../../src/catalog/domain/IProductRepository';
import Product from '../../../src/catalog/domain/Product';
import ProductNotFound from '../../../src/catalog/app/ProductNotFound';
import { DefaultProductParams, UpdateProductParams } from '../../../src/catalog/app/IProductService';
import IGenerateID from '../../../src/catalog/app/IGenerateID';
import Category from '../../../src/catalog/domain/Category';
import IStockService from '../../../src/catalog/domain/IStockService';

const fakeCategories = [
  {
    id: 'test_category_id_1',
    name: 'test_category_1',
    code: 123,
  },
  {
    id: 'test_category_id_2',
    name: 'test_category_2',
    code: 124,
  },
];

const fakeProducts = [
  {
    id: 'test_product_id_1',
    name: 'test_product_1',
    description: 'test_product_1',
    amount: Math.random() * 100,
    image: 'http://example.com',
    stockQuantity: parseInt((Math.random() * 10).toString(), 10),
    createdAt: new Date(),
    dimensions: {
      height: Math.random() * 50,
      width: Math.random() * 50,
      depth: Math.random() * 50,
    },
    category: fakeCategories[0],
  },
  {
    id: 'test_product_id_2',
    name: 'test_product_2',
    description: 'test_product_2',
    amount: Math.random() * 100,
    image: 'http://example.com',
    stockQuantity: parseInt((Math.random() * 10).toString(), 10),
    createdAt: new Date(),
    dimensions: {
      height: Math.random() * 50,
      width: Math.random() * 50,
      depth: Math.random() * 50,
    },
    category: fakeCategories[0],
  },
  {
    id: 'test_product_id_3',
    name: 'test_product_3',
    description: 'test_product_3',
    amount: Math.random() * 100,
    image: 'http://example.com',
    stockQuantity: parseInt((Math.random() * 10).toString(), 10),
    createdAt: new Date(),
    dimensions: {
      height: Math.random() * 50,
      width: Math.random() * 50,
      depth: Math.random() * 50,
    },
    category: fakeCategories[1],
  },
];

class RepositoryStub implements IProductOperations {
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

class StockServiceStub implements IStockService {
  addToStock(productId: string, quantity: number): Promise<boolean> {
    const index = fakeProducts.findIndex((p) => p.id === productId);

    fakeProducts[index].stockQuantity += quantity;

    return Promise.resolve(true);
  }

  removeFromStock(productId: string, quantity: number): Promise<boolean> {
    const index = fakeProducts.findIndex((p) => p.id === productId);

    fakeProducts[index].stockQuantity -= quantity;

    return Promise.resolve(true);
  }
}

const generateIDMock: IGenerateID = jest.fn(() => `test_product_id_${fakeProducts.length + 1}`);

describe('ProductsService\'s unit tests', () => {
  describe('ProductService.getAllProducts', () => {
    it('returns all products', async () => {
      expect.assertions(2);

      const repositoryStub = new RepositoryStub();
      const getAllProductsSpy = jest.spyOn(repositoryStub, 'getAllProducts');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);
      const products = await productService.getAllProducts();

      expect(products).toHaveLength(fakeProducts.length);
      expect(getAllProductsSpy).toHaveBeenCalled();
    });
  });

  describe('ProductService.getProductById', () => {
    it('returns a product by id', async () => {
      expect.assertions(10);

      const repositoryStub = new RepositoryStub();
      const getProductByIdSpy = jest.spyOn(repositoryStub, 'getProductById');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);
      const product = await productService.getProductById(fakeProducts[0].id);

      expect(getProductByIdSpy).toHaveBeenCalled();
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

    it('throws an exception of type ProductNotFound if the product is null', async () => {
      expect.assertions(3);

      const repositoryStub = new RepositoryStub();
      const getProductByIdSpy = jest.spyOn(repositoryStub, 'getProductById');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);

      try {
        await productService.getProductById('wrong_id');
      } catch (e: any) {
        expect(e).toBeInstanceOf(ProductNotFound);
        expect(e.message).toEqual('O produto não foi encontrado.');
        expect(getProductByIdSpy).toHaveBeenCalled();
      }
    });
  });

  describe('ProductService.getProductsByCategory', () => {
    it('reutrns all products related to one specific category', async () => {
      expect.assertions(3);

      const repositoryStub = new RepositoryStub();
      const getProductsByCategorySpy = jest.spyOn(repositoryStub, 'getProductsByCategory');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);
      const firstCategoryProducts = await productService
        .getProductsByCategory(fakeCategories[0].id);
      const secondCategoryProducts = await productService
        .getProductsByCategory(fakeCategories[1].id);

      expect(firstCategoryProducts).toHaveLength(2);
      expect(secondCategoryProducts).toHaveLength(1);
      expect(getProductsByCategorySpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('ProductService.createProduct', () => {
    it('creates a new product', async () => {
      expect.assertions(5);

      const repositoryStub = new RepositoryStub();
      const addProductSpy = jest.spyOn(repositoryStub, 'addProduct');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);

      const params: DefaultProductParams = {
        name: 'test_new_product',
        amount: Math.random() * 100,
        category: fakeCategories[0] as Category,
        description: 'test_new_product',
        dimensions: {
          height: Math.random() * 50,
          width: Math.random() * 50,
          depth: Math.random() * 50,
        },
        image: 'http://example.com/new_product.jpg',
        stockQuantity: parseInt((Math.random() * 10).toString(), 10),
      };

      const product = await productService.createProduct(params);

      expect(product.id).toBeTruthy();
      expect(product.createdAt).toBeInstanceOf(Date);
      expect(fakeProducts.find((p) => p.id === product.id)).toBeTruthy();
      expect(addProductSpy).toHaveBeenCalled();
      expect(generateIDMock).toHaveBeenCalled();
    });
  });

  describe('ProductService.updateProduct', () => {
    it('updates an existing product', async () => {
      expect.assertions(11);

      const repositoryStub = new RepositoryStub();
      const getProductByIdSpy = jest.spyOn(repositoryStub, 'getProductById');
      const updateProductSpy = jest.spyOn(repositoryStub, 'updateProduct');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);

      const params: UpdateProductParams = {
        name: 'test_product_updated',
        amount: Math.random() * 100,
        category: fakeCategories[0] as Category,
        description: 'test_product_updated',
        dimensions: {
          height: Math.random() * 50,
          width: Math.random() * 50,
          depth: Math.random() * 50,
        },
        image: 'http://example.com/product_updated.jpg',
        stockQuantity: parseInt((Math.random() * 10).toString(), 10),
      };

      await productService.updateProduct(fakeProducts[0].id, params);
      const updatedProduct = fakeProducts.find((p) => p.id === 'test_product_id_1');

      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct!.name).toEqual(params.name);
      expect(updatedProduct!.amount).toEqual(params.amount);
      expect(updatedProduct!.description).toEqual(params.description);
      expect(updatedProduct!.image).toEqual(params.image);
      expect(updatedProduct!.stockQuantity).toEqual(params.stockQuantity);
      expect(updatedProduct!.category.id).toEqual(params.category!.id);
      expect(updatedProduct!.category.name).toEqual(params.category!.name);
      expect(updatedProduct!.category.code).toEqual(params.category!.code);
      expect(getProductByIdSpy).toHaveBeenCalled();
      expect(updateProductSpy).toHaveBeenCalled();
    });

    it('throws an ProductNotFound if repository.getProductById returns null', async () => {
      expect.assertions(2);

      const repositoryStub = new RepositoryStub();
      const getProductByIdSpy = jest.spyOn(repositoryStub, 'getProductById');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);

      const params: UpdateProductParams = {
        name: 'test_product_updated',
        amount: Math.random() * 100,
        category: fakeCategories[0] as Category,
        description: 'test_product_updated',
        dimensions: {
          height: Math.random() * 50,
          width: Math.random() * 50,
          depth: Math.random() * 50,
        },
        image: 'http://example.com/product_updated.jpg',
        stockQuantity: parseInt((Math.random() * 10).toString(), 10),
      };

      try {
        await productService.updateProduct('wrong_id', params);
      } catch (e) {
        expect(e).toBeInstanceOf(ProductNotFound);
        expect(getProductByIdSpy).toHaveBeenCalled();
      }
    });
  });

  describe('ProductService.updateProductStock', () => {
    it('removes products if is passed a negative quantity', async () => {
      expect.assertions(3);

      const repositoryStub = new RepositoryStub();
      const stockServiceStub = new StockServiceStub();
      const removeFromStockSpy = jest.spyOn(stockServiceStub, 'removeFromStock');

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);

      const currentQty = fakeProducts[2].stockQuantity;

      await productService.updateProductStock(fakeProducts[2].id, -1);

      expect(fakeProducts[2].stockQuantity).toEqual(currentQty - 1);
      expect(removeFromStockSpy).toHaveBeenCalledTimes(1);
      expect(removeFromStockSpy).toHaveBeenCalledWith(fakeProducts[2].id, 1);
    });
  });
});
