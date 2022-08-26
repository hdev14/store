import ProductService from '@catalog/app/ProductService';
import ProductNotFoundError from '@catalog/app/ProductNotFoundError';
import { DefaultProductParams, UpdateProductParams } from '@catalog/app/IProductService';
import StockError from '@catalog/app/StockError';
import RepositoryStub from '@tests/store/stubs/ProductRepositoryStub';
import StockServiceStub from '@tests/store/stubs/StockServiceStub';
import createGenerateIDMock from '@tests/store/stubs/createGenerateIDMock';
import { fakeCategories, fakeProducts } from '@tests/store/fakes';
import { faker } from '@faker-js/faker';
import CategoryNotFoundError from '@catalog/app/CategoryNotFoundError';

describe('ProductsService\'s unit tests', () => {
  describe('ProductService.getAllProducts', () => {
    it('returns all products', async () => {
      expect.assertions(2);

      const repositoryStub = new RepositoryStub();
      const getAllProductsSpy = jest.spyOn(repositoryStub, 'getAllProducts');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );
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

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );
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

    it('throws an exception of type ProductNotFoundError if the product is null', async () => {
      expect.assertions(3);

      const repositoryStub = new RepositoryStub();
      const getProductByIdSpy = jest.spyOn(repositoryStub, 'getProductById');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );

      try {
        await productService.getProductById('wrong_id');
      } catch (e: any) {
        expect(e).toBeInstanceOf(ProductNotFoundError);
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

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );
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
      const generateIDMock = createGenerateIDMock(fakeProducts);

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);

      const params: DefaultProductParams = {
        name: 'test_new_product',
        amount: Math.random() * 100,
        categoryId: fakeCategories[0].id,
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

    it("throws an exception of CategoryNotFoundError if category doesn't exist", async () => {
      expect.assertions(3);

      const fakeCategoryId = faker.datatype.uuid();
      const repositoryStub = new RepositoryStub();
      const getCategoryByIdSpy = jest.spyOn(repositoryStub, 'getCategoryById');
      const stockServiceStub = new StockServiceStub();
      const generateIDMock = createGenerateIDMock(fakeProducts);

      const productService = new ProductService(repositoryStub, generateIDMock, stockServiceStub);

      const params: DefaultProductParams = {
        name: 'test_new_product',
        amount: Math.random() * 100,
        categoryId: fakeCategoryId,
        description: 'test_new_product',
        dimensions: {
          height: Math.random() * 50,
          width: Math.random() * 50,
          depth: Math.random() * 50,
        },
        image: 'http://example.com/new_product.jpg',
        stockQuantity: parseInt((Math.random() * 10).toString(), 10),
      };

      try {
        await productService.createProduct(params);
      } catch (e) {
        expect(getCategoryByIdSpy).toHaveBeenCalled();
        expect(getCategoryByIdSpy).toHaveBeenCalledWith(fakeCategoryId);
        expect(e).toBeInstanceOf(CategoryNotFoundError);
      }
    });
  });

  describe('ProductService.updateProduct', () => {
    it('updates an existing product', async () => {
      expect.assertions(11);

      const repositoryStub = new RepositoryStub();
      const getProductByIdSpy = jest.spyOn(repositoryStub, 'getProductById');
      const updateProductSpy = jest.spyOn(repositoryStub, 'updateProduct');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );

      const params: UpdateProductParams = {
        name: 'test_product_updated',
        amount: Math.random() * 100,
        categoryId: fakeCategories[0].id,
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
      expect(updatedProduct!.category.id).toEqual(fakeCategories[0].id);
      expect(updatedProduct!.category.name).toEqual(fakeCategories[0].name);
      expect(updatedProduct!.category.code).toEqual(fakeCategories[0].code);
      expect(getProductByIdSpy).toHaveBeenCalled();
      expect(updateProductSpy).toHaveBeenCalled();
    });

    it('throws an ProductNotFoundError if repository.getProductById returns null', async () => {
      expect.assertions(2);

      const repositoryStub = new RepositoryStub();
      const getProductByIdSpy = jest.spyOn(repositoryStub, 'getProductById');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );

      const params: UpdateProductParams = {
        name: 'test_product_updated',
        amount: Math.random() * 100,
        categoryId: fakeCategories[0].id,
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
        expect(e).toBeInstanceOf(ProductNotFoundError);
        expect(getProductByIdSpy).toHaveBeenCalled();
      }
    });

    it('throws an CategoryNotFound if repository.getCategoryById returns null', async () => {
      expect.assertions(2);

      const repositoryStub = new RepositoryStub();
      const getCategoryByIdSpy = jest.spyOn(repositoryStub, 'getCategoryById');
      const stockServiceStub = new StockServiceStub();

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );

      const fakeCategoryId = faker.datatype.uuid();

      const params: UpdateProductParams = {
        name: 'test_product_updated',
        amount: Math.random() * 100,
        categoryId: fakeCategoryId,
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
        await productService.updateProduct(fakeProducts[0].id, params);
      } catch (e) {
        expect(e).toBeInstanceOf(CategoryNotFoundError);
        expect(getCategoryByIdSpy).toHaveBeenCalled();
      }
    });
  });

  describe('ProductService.updateProductStock', () => {
    it('removes products if is passed a negative quantity', async () => {
      expect.assertions(3);

      const repositoryStub = new RepositoryStub();
      const stockServiceStub = new StockServiceStub();
      const removeFromStockSpy = jest.spyOn(stockServiceStub, 'removeFromStock');

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );

      const currentQty = fakeProducts[2].stockQuantity;

      await productService.updateProductStock(fakeProducts[2].id, -1);

      expect(fakeProducts[2].stockQuantity).toEqual(currentQty - 1);
      expect(removeFromStockSpy).toHaveBeenCalledTimes(1);
      expect(removeFromStockSpy).toHaveBeenCalledWith(fakeProducts[2].id, 1);
    });

    it('adds products if is passed a positive quantity', async () => {
      expect.assertions(3);

      const repositoryStub = new RepositoryStub();
      const stockServiceStub = new StockServiceStub();
      const addToStockSpy = jest.spyOn(stockServiceStub, 'addToStock');

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );

      const currentQty = fakeProducts[2].stockQuantity;

      await productService.updateProductStock(fakeProducts[2].id, 1);

      expect(fakeProducts[2].stockQuantity).toEqual(currentQty + 1);
      expect(addToStockSpy).toHaveBeenCalledTimes(1);
      expect(addToStockSpy).toHaveBeenCalledWith(fakeProducts[2].id, 1);
    });

    it('throws an expection of type StockError if StockService.removeFromStock returns false', async () => {
      expect.assertions(2);

      const repositoryStub = new RepositoryStub();
      const stockServiceStub = new StockServiceStub();
      stockServiceStub.removeFromStock = jest.fn(() => Promise.resolve(false));

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );

      try {
        await productService.updateProductStock(fakeProducts[2].id, -1);
      } catch (e) {
        expect(e).toBeInstanceOf(StockError);
        expect(stockServiceStub.removeFromStock).toHaveBeenCalled();
      }
    });

    it('throws an expection of type StockError if StockService.addToStock returns false', async () => {
      expect.assertions(2);

      const repositoryStub = new RepositoryStub();
      const stockServiceStub = new StockServiceStub();
      stockServiceStub.addToStock = jest.fn(() => Promise.resolve(false));

      const productService = new ProductService(
        repositoryStub,
        createGenerateIDMock(fakeProducts),
        stockServiceStub,
      );

      try {
        await productService.updateProductStock(fakeProducts[2].id, 1);
      } catch (e) {
        expect(e).toBeInstanceOf(StockError);
        expect(stockServiceStub.addToStock).toHaveBeenCalled();
      }
    });
  });
});
