import Category from '../../../src/catalog/domain/Category';
import IProductRepository from '../../../src/catalog/domain/IProductRepository';
import Product from '../../../src/catalog/domain/Product';
import StockService from '../../../src/catalog/domain/StockService';

const fakeProduct: any = {
  stockQuantity: 10,
  addToStock(quantity: number) {
    this.stockQuantity += quantity;
  },
  removeFromStock(quantity: number) {
    this.stockQuantity -= quantity;
  },
  hasStockFor: jest.fn(() => true),
};

class ProductRepositoryMock implements IProductRepository {
  getAllProducts(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  getProductById(_: string): Promise<Product | null> {
    return Promise.resolve(fakeProduct);
  }

  getProductsByCategory(_: Category): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  getAllCategories(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  addProduct(_: Product): Product | Promise<Product> {
    throw new Error('Method not implemented.');
  }

  updateProduct(_: Product): Product | Promise<Product> {
    throw new Error('Method not implemented.');
  }

  addCategory(_: Category): Category | Promise<Category> {
    throw new Error('Method not implemented.');
  }

  updateCategory(_: Category): Category | Promise<Category> {
    throw new Error('Method not implemented.');
  }
}

describe('StockService\'s Unit Tests', () => {
  describe('StockService.removeFromStock', () => {
    it('returns false if product doesn\'t exist', async () => {
      const productRepositoryMock = new ProductRepositoryMock();
      productRepositoryMock.getProductById = jest.fn(() => Promise.resolve(null));

      const stockService = new StockService(productRepositoryMock);
      const result = await stockService.removeFromStock('test_product_id', 1);

      expect(result).toBe(false);
    });

    it('returns false if product doesn\'t have stock', async () => {
      const productRepositoryMock = new ProductRepositoryMock();
      (fakeProduct.hasStockFor as jest.Mock).mockReturnValueOnce(false);

      const stockService = new StockService(productRepositoryMock);
      const result = await stockService.removeFromStock('test_product_id', 1);

      expect(result).toBe(false);
    });

    it('removes a quantity of products from stock', async () => {
      const productRepositoryMock = new ProductRepositoryMock();
      productRepositoryMock.updateProduct = jest.fn(() => Promise.resolve({} as Product));
      const removeFromStockSpy = jest.spyOn(fakeProduct, 'removeFromStock');

      const stockService = new StockService(productRepositoryMock);
      const result = await stockService.removeFromStock('test_product_id', 1);

      expect(result).toBe(true);
      expect(removeFromStockSpy).toHaveBeenCalledWith(1);
      expect(productRepositoryMock.updateProduct).toHaveBeenCalledWith(fakeProduct);
    });
  });

  describe('StockService.addToStock', () => {
    it('returns false if product doesn\'t exist', async () => {
      const productRepositoryMock = new ProductRepositoryMock();
      productRepositoryMock.getProductById = jest.fn(() => Promise.resolve(null));

      const stockService = new StockService(productRepositoryMock);
      const result = await stockService.addToStock('test_product_id', 1);

      expect(result).toBe(false);
    });

    it('removes a quantity of products from stock', async () => {
      const productRepositoryMock = new ProductRepositoryMock();
      productRepositoryMock.updateProduct = jest.fn(() => Promise.resolve({} as Product));
      const addToStockSpy = jest.spyOn(fakeProduct, 'addToStock');

      const stockService = new StockService(productRepositoryMock);
      const result = await stockService.addToStock('test_product_id', 1);

      expect(result).toBe(true);
      expect(addToStockSpy).toHaveBeenCalledWith(1);
      expect(productRepositoryMock.updateProduct).toHaveBeenCalledWith(fakeProduct);
    });
  });
});
