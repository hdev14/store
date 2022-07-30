import ProductService from '../../../src/catalog/app/ProductService';
import { IProductOperations } from '../../../src/catalog/domain/IProductRepository';
import Product from '../../../src/catalog/domain/Product';
import ProductNotFound from '../../../src/catalog/app/ProductNotFound';
import { DefaultProductParams } from '../../../src/catalog/app/IProductService';
import IGenerateID from '../../../src/catalog/app/IGenerateID';
import Category from '../../../src/catalog/domain/Category';

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

  updateProduct(_: Product): Product | Promise<Product> {
    throw new Error('Method not implemented.');
  }
}

const generateIDMock: IGenerateID = jest.fn(() => `test_product_id_${fakeProducts.length + 1}`);

describe('ProductsService\'s unit tests', () => {
  describe('ProductService.getAllProducts', () => {
    it('returns all products', async () => {
      expect.assertions(2);

      const repositoryStub = new RepositoryStub();
      const getAllProductsSpy = jest.spyOn(repositoryStub, 'getAllProducts');

      const productService = new ProductService(repositoryStub, generateIDMock);
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

      const productService = new ProductService(repositoryStub, generateIDMock);
      const product = await productService.getProductById('test_product_id_1');

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

      const productService = new ProductService(repositoryStub, generateIDMock);

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

      const productService = new ProductService(repositoryStub, generateIDMock);
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

      const productService = new ProductService(repositoryStub, generateIDMock);

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

    // it('throws an exception of type ValidationEntityError if data is invalid', async () => {

    // });
  });
});
